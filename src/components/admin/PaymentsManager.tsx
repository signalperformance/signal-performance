
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, differenceInDays, isAfter, getDaysInMonth, addMonths } from 'date-fns';
import { MarkPaymentModal } from './MarkPaymentModal';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { Search } from 'lucide-react';

type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'stripe' | 'other';

interface UserProfileLite {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  monthly_renewal_date: string | null;
  is_active: boolean;
}

interface PaymentRecord {
  id: string;
  user_profile_id: string;
  period_month: string; // date string YYYY-MM-DD (normalized to 1st)
  is_paid: boolean;
  paid_at: string | null; // date
  payment_method: PaymentMethod | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

type StatusFilter = 'all' | 'paid' | 'due-soon' | 'overdue' | 'unpaid';

function getMonthFirst(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateString(d: Date) {
  // format as YYYY-MM-DD
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dueDateForMonth(renewalDateStr: string | null, monthDate: Date): Date | null {
  if (!renewalDateStr) return null;
  const renewal = parseISO(renewalDateStr);
  const day = renewal.getDate();
  const last = getDaysInMonth(monthDate);
  const dueDay = Math.min(day, last);
  return new Date(monthDate.getFullYear(), monthDate.getMonth(), dueDay);
}

function computeStatus(record: PaymentRecord | undefined, dueDate: Date | null): StatusFilter {
  if (record?.is_paid) return 'paid';
  if (!dueDate) return 'unpaid';
  const today = new Date();
  if (isAfter(today, dueDate)) return 'overdue';
  const days = differenceInDays(dueDate, today);
  if (days >= 0 && days <= 7) return 'due-soon';
  return 'unpaid';
}

export function PaymentsManager() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfileLite[]>([]);
  const [recordsByUser, setRecordsByUser] = useState<Record<string, PaymentRecord>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}`;
  });
  const [editingUser, setEditingUser] = useState<UserProfileLite | null>(null);

  const monthDate = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    return new Date(y, (m || 1) - 1, 1);
  }, [selectedMonth]);

  const normalizedMonthStr = useMemo(() => toDateString(getMonthFirst(monthDate)), [monthDate]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (users.length) {
      loadPaymentRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, normalizedMonthStr]);

  const loadUsers = async () => {
    console.log('[PaymentsManager] Loading users...');
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, email, monthly_renewal_date, is_active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users.',
        variant: 'destructive',
      });
      return;
    }
    setUsers(data || []);
  };

  const loadPaymentRecords = async () => {
    console.log('[PaymentsManager] Loading payment records for', normalizedMonthStr);
    const { data, error } = await supabase
      .from('user_payment_records')
      .select('*')
      .eq('period_month', normalizedMonthStr);

    if (error) {
      console.error('Failed to load payment records:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment records.',
        variant: 'destructive',
      });
      return;
    }

    const map: Record<string, PaymentRecord> = {};
    (data || []).forEach((r) => {
      map[r.user_profile_id] = r as PaymentRecord;
    });
    setRecordsByUser(map);
  };

  const rows = useMemo(() => {
    const lower = search.trim().toLowerCase();
    const today = new Date();

    return users
      .filter((u) => {
        if (!lower) return true;
        return (
          u.first_name.toLowerCase().includes(lower) ||
          u.last_name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower)
        );
      })
      .map((u) => {
        const record = recordsByUser[u.id];
        const dueDate = dueDateForMonth(u.monthly_renewal_date, monthDate);
        const status = computeStatus(record, dueDate);
        const daysUntil = dueDate ? differenceInDays(dueDate, today) : null;
        return {
          user: u,
          record,
          dueDate,
          status,
          daysUntil,
        };
      })
      .filter((r) => (filter === 'all' ? true : r.status === filter));
  }, [users, recordsByUser, search, filter, monthDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payments</h2>
          <p className="text-muted-foreground">Track monthly payments by client</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Select month, search users, and filter by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Month</label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-[200px]"
              />
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="w-full md:w-[220px]">
              <Select value={filter} onValueChange={(v: StatusFilter) => setFilter(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="due-soon">Due Soon</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Payments</CardTitle>
          <CardDescription>
            Showing {rows.length} of {users.length} users for {format(monthDate, 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid At</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ user, record, dueDate, status, daysUntil }) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                    {!user.is_active && (
                      <Badge variant="secondary" className="ml-2">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {dueDate ? format(dueDate, 'MMM dd, yyyy') : (
                      <span className="text-muted-foreground">No renewal date</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={status} />
                    {status !== 'paid' && dueDate && daysUntil !== null && daysUntil >= 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record?.is_paid && record.paid_at
                      ? format(parseISO(record.paid_at), 'MMM dd, yyyy')
                      : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="capitalize">
                    {record?.is_paid && record.payment_method ? record.payment_method.replace('_', ' ') : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => setEditingUser(user)}>
                      {record?.is_paid ? 'Edit' : 'Mark Paid'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No users match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingUser && (
        <MarkPaymentModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          periodMonth={normalizedMonthStr}
          existingRecord={recordsByUser[editingUser.id]}
          onSaved={() => {
            setEditingUser(null);
            loadPaymentRecords();
          }}
        />
      )}
    </div>
  );
}
