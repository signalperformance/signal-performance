import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface UserSessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

interface SessionHistoryEntry {
  booking_id: string;
  live_schedule_instance_id: string;
  class_date: string;
  start_time: string;
  duration: number;
  class_name: string;
  session_type: string;
  max_participants: number;
  current_participants: number;
  booking_created_at: string;
  is_cancelled: boolean;
  attended?: boolean | null;
  attendance_notes?: string;
  marked_at?: string;
  can_cancel: boolean;
}

export const UserSessionHistoryModal = ({ isOpen, onClose, user }: UserSessionHistoryModalProps) => {
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<string | null>(null);
  const [attendanceNotes, setAttendanceNotes] = useState('');
  const { toast } = useToast();

  const loadSessionHistory = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Get all bookings for this user (no nested relations to avoid FK issues)
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(
          `id, booking_date, created_at, schedule_entry_id`
        )
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;

      const bookingIds: string[] = bookings?.map((b: any) => b.id) || [];
      const scheduleEntryIds: string[] = (bookings?.map((b: any) => b.schedule_entry_id).filter(Boolean)) || [];
      const bookingDates: string[] = Array.from(
        new Set((bookings?.map((b: any) => b.booking_date).filter(Boolean)) || [])
      );

      // Fetch schedule entry details for timing/class meta
      let scheduleEntriesMap: Record<string, any> = {};
      if (scheduleEntryIds.length) {
        const { data: scheduleEntries, error: seError } = await supabase
          .from('schedule_entries')
          .select('id, start_time, duration, class_name, session_type, max_participants')
          .in('id', scheduleEntryIds);
        if (seError) throw seError;
        scheduleEntriesMap = (scheduleEntries || []).reduce((acc: any, se: any) => {
          acc[se.id] = se;
          return acc;
        }, {});
      }

      // Build filters for live instances
      const startTimes = Array.from(new Set(
        scheduleEntryIds.map((id: string) => scheduleEntriesMap[id]?.start_time).filter(Boolean)
      ));
      const classNames = Array.from(new Set(
        scheduleEntryIds.map((id: string) => scheduleEntriesMap[id]?.class_name).filter(Boolean)
      ));
      const sessionTypes = Array.from(new Set(
        scheduleEntryIds.map((id: string) => scheduleEntriesMap[id]?.session_type).filter(Boolean)
      ));

      // Fetch matching live schedule instances by date + time + class (and type) to locate IDs
      let liveInstanceMap: Record<string, any> = {};
      if (bookingDates.length && startTimes.length && classNames.length) {
        const { data: liveInstances, error: liError } = await supabase
          .from('live_schedule_instances')
          .select('id, class_date, start_time, duration, class_name, session_type, max_participants, is_cancelled')
          .in('class_date', bookingDates)
          .in('start_time', startTimes)
          .in('class_name', classNames);
        if (!liError) {
          liveInstanceMap = (liveInstances || []).reduce((acc: any, inst: any) => {
            const key = `${inst.class_date}|${inst.start_time}|${inst.class_name}|${inst.session_type}`;
            acc[key] = inst;
            return acc;
          }, {});
        } else {
          console.warn('Live instances lookup failed:', liError);
        }
      }

      // Participant counts grouped by entry and date
      let participantCountMap: Record<string, number> = {};
      if (scheduleEntryIds.length && bookingDates.length) {
        const { data: participantCounts } = await supabase
          .from('bookings')
          .select('schedule_entry_id, booking_date')
          .in('schedule_entry_id', scheduleEntryIds)
          .in('booking_date', bookingDates);
        participantCountMap = (participantCounts || []).reduce((acc: any, row: any) => {
          const k = `${row.schedule_entry_id}|${row.booking_date}`;
          acc[k] = (acc[k] || 0) + 1;
          return acc;
        }, {});
      }

      // Fetch attendance separately; if it fails due to RLS, continue gracefully
      let attendanceMap: Record<string, any> = {};
      try {
        if (bookingIds.length) {
          const { data: attendanceData } = await supabase
            .from('user_attendance')
            .select('booking_id, attended, notes, marked_at, live_schedule_instance_id')
            .in('booking_id', bookingIds)
            .eq('user_id', user.id);
          attendanceMap = (attendanceData || []).reduce((acc: any, a: any) => {
            acc[a.booking_id] = a;
            return acc;
          }, {});
        }
      } catch (attErr) {
        console.warn('Attendance fetch skipped:', attErr);
      }

      const formattedData: SessionHistoryEntry[] = (bookings || [])
        .map((booking: any) => {
          const se = scheduleEntriesMap[booking.schedule_entry_id];
          if (!se) return null; // Skip if no schedule entry meta found

          const key = `${booking.booking_date}|${se.start_time}|${se.class_name}|${se.session_type}`;
          const inst = liveInstanceMap[key];
          const attendance = attendanceMap[booking.id];

          const now = new Date();
          const sessionDateTime = new Date(`${booking.booking_date}T${se.start_time}`);
          const canCancel = sessionDateTime.getTime() - now.getTime() > 3 * 60 * 60 * 1000; // 3 hours

          return {
            booking_id: booking.id,
            live_schedule_instance_id: inst?.id || '',
            class_date: booking.booking_date,
            start_time: se.start_time,
            duration: se.duration,
            class_name: se.class_name,
            session_type: se.session_type,
            max_participants: inst?.max_participants ?? se.max_participants,
            current_participants: participantCountMap[`${booking.schedule_entry_id}|${booking.booking_date}`] || 0,
            booking_created_at: booking.created_at,
            is_cancelled: inst?.is_cancelled ?? false,
            attended: attendance?.attended ?? null,
            attendance_notes: attendance?.notes,
            marked_at: attendance?.marked_at,
            can_cancel: canCancel && !(inst?.is_cancelled)
          } as SessionHistoryEntry;
        })
        .filter(Boolean) as SessionHistoryEntry[];

      setSessionHistory(formattedData);
    } catch (error) {
      console.error('Error loading session history:', error);
      toast({
        title: "Error",
        description: "Failed to load session history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (bookingId: string, attended: boolean, notes: string) => {
    try {
      // Find the session for this booking to get the live_schedule_instance_id
      const session = sessionHistory.find(s => s.booking_id === bookingId);
      if (!session) {
        throw new Error('Session not found');
      }
      if (!session.live_schedule_instance_id) {
        toast({
          title: "Missing session link",
          description: "This booking isn't linked to a live session yet. Please regenerate live instances or contact support.",
          variant: "destructive",
        });
        return;
      }
      const { error } = await supabase
        .from('user_attendance')
        .upsert({
          booking_id: bookingId,
          user_id: user.id,
          live_schedule_instance_id: session.live_schedule_instance_id,
          attended,
          notes: notes || null,
          marked_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Attendance marked as ${attended ? 'attended' : 'no-show'}`,
      });

      setEditingAttendance(null);
      setAttendanceNotes('');
      loadSessionHistory();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (session: SessionHistoryEntry) => {
    const sessionDate = new Date(`${session.class_date}T${session.start_time}`);
    const now = new Date();
    const isPast = sessionDate < now;

    if (session.is_cancelled) {
      return <Badge variant="destructive">Cancelled</Badge>;
    }

    if (isPast) {
      if (session.attended === true) {
        return <Badge variant="default" className="bg-green-500">Attended</Badge>;
      } else if (session.attended === false) {
        return <Badge variant="destructive">No Show</Badge>;
      } else {
        return <Badge variant="secondary">Not Marked</Badge>;
      }
    }

    return <Badge variant="outline">Upcoming</Badge>;
  };

  useEffect(() => {
    if (isOpen && user?.id) {
      loadSessionHistory();
    }
  }, [isOpen, user?.id]);

  const upcomingSessions = sessionHistory.filter(session => {
    const sessionDate = new Date(`${session.class_date}T${session.start_time}`);
    return sessionDate > new Date() && !session.is_cancelled;
  });

  const pastSessions = sessionHistory.filter(session => {
    const sessionDate = new Date(`${session.class_date}T${session.start_time}`);
    return sessionDate <= new Date();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Session History - {user?.first_name} {user?.last_name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading session history...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{upcomingSessions.length}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {pastSessions.filter(s => s.attended === true).length}
                </div>
                <div className="text-sm text-muted-foreground">Attended</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {pastSessions.filter(s => s.attended === false).length}
                </div>
                <div className="text-sm text-muted-foreground">No Shows</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {pastSessions.filter(s => s.attended === null && !s.is_cancelled).length}
                </div>
                <div className="text-sm text-muted-foreground">Not Marked</div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Sessions ({upcomingSessions.length})
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingSessions.map((session) => (
                      <TableRow key={session.booking_id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {format(new Date(session.class_date), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(`2000-01-01T${session.start_time}`), 'h:mm a')} 
                              ({session.duration} min)
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{session.class_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{session.session_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.current_participants}/{session.max_participants}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(session)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(session.booking_created_at), 'MMM dd, h:mm a')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Past Sessions */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Past Sessions ({pastSessions.length})
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastSessions.map((session) => (
                    <TableRow key={session.booking_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {format(new Date(session.class_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(`2000-01-01T${session.start_time}`), 'h:mm a')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{session.class_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{session.session_type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(session)}</TableCell>
                      <TableCell>
                        {editingAttendance === session.booking_id ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                id={`attended-${session.booking_id}`}
                                checked={session.attended === true}
                                onCheckedChange={(checked) => {
                                  markAttendance(session.booking_id, checked, attendanceNotes);
                                }}
                              />
                              <Label htmlFor={`attended-${session.booking_id}`}>
                                Attended
                              </Label>
                            </div>
                            <Textarea
                              placeholder="Add notes (optional)"
                              value={attendanceNotes}
                              onChange={(e) => setAttendanceNotes(e.target.value)}
                              className="min-h-[60px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => markAttendance(session.booking_id, true, attendanceNotes)}
                              >
                                Mark Attended
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAttendance(session.booking_id, false, attendanceNotes)}
                              >
                                Mark No-Show
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingAttendance(null);
                                  setAttendanceNotes('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {session.attended === true && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {session.attended === false && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            {session.attended === null && !session.is_cancelled && (
                              <AlertCircle className="h-4 w-4 text-orange-600" />
                            )}
                            <span className="text-sm">
                              {session.attended === true ? 'Attended' : 
                               session.attended === false ? 'No Show' : 
                               session.is_cancelled ? 'Cancelled' : 'Not Marked'}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {session.attendance_notes || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {!session.is_cancelled && editingAttendance !== session.booking_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingAttendance(session.booking_id);
                              setAttendanceNotes(session.attendance_notes || '');
                            }}
                          >
                            {session.attended !== null ? 'Edit' : 'Mark'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {sessionHistory.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No session history found for this user.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};