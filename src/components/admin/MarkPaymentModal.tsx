
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
  period_month: string;
  is_paid: boolean;
  paid_at: string | null;
  payment_method: PaymentMethod | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface MarkPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  user: UserProfileLite;
  periodMonth: string; // YYYY-MM-01
  existingRecord?: PaymentRecord;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function MarkPaymentModal({
  isOpen,
  onClose,
  onSaved,
  user,
  periodMonth,
  existingRecord,
}: MarkPaymentModalProps) {
  const { toast } = useToast();

  const [isPaid, setIsPaid] = useState<boolean>(existingRecord?.is_paid ?? true);
  const [paidAt, setPaidAt] = useState<string>(existingRecord?.paid_at ?? todayStr());
  const [method, setMethod] = useState<PaymentMethod>(existingRecord?.payment_method ?? 'cash');
  const [notes, setNotes] = useState<string>(existingRecord?.notes ?? '');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    setIsPaid(existingRecord?.is_paid ?? true);
    setPaidAt(existingRecord?.paid_at ?? todayStr());
    setMethod((existingRecord?.payment_method as PaymentMethod) ?? 'cash');
    setNotes(existingRecord?.notes ?? '');
  }, [existingRecord, isOpen]);

  const handleSave = async () => {
    setSaving(true);
    console.log('[MarkPaymentModal] Saving payment record', { userId: user.id, periodMonth, isPaid, paidAt, method, notes });
    const payload = {
      user_profile_id: user.id,
      period_month: periodMonth,
      is_paid: isPaid,
      paid_at: isPaid ? paidAt : null,
      payment_method: isPaid ? method : null,
      notes: notes || null,
    };

    const { error } = await supabase
      .from('user_payment_records')
      .upsert(payload, { onConflict: 'user_profile_id,period_month' });

    setSaving(false);

    if (error) {
      console.error('Failed to save payment record:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment record.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Saved',
      description: 'Payment record updated.',
    });
    onSaved();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment for {user.first_name} {user.last_name}</DialogTitle>
          <DialogDescription>
            Period: {periodMonth}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <Label className="w-28">Status</Label>
            <Select value={isPaid ? 'paid' : 'unpaid'} onValueChange={(v) => setIsPaid(v === 'paid')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="w-28">Paid At</Label>
            <Input
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              className="w-[200px]"
              disabled={!isPaid}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="w-28">Method</Label>
            <Select value={method} onValueChange={(v: PaymentMethod) => setMethod(v)} disabled={!isPaid}>
              <SelectTrigger className="w-[200px] capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank transfer</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="w-28">Notes</Label>
            <Input
              placeholder="Optional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
