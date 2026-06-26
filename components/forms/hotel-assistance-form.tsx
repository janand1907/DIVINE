'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CircleCheck as CheckCircle } from 'lucide-react';

const BUDGET_OPTIONS = ['Under ₹1,000/night', '₹1,000–₹3,000/night', '₹3,000–₹7,000/night', '₹7,000–₹15,000/night', 'Above ₹15,000/night'];

export function HotelAssistanceForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    check_in: '',
    check_out: '',
    rooms: '1',
    adults: '2',
    children: '0',
    budget: '',
    message: '',
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          mobile: form.mobile,
          email: form.email || undefined,
          destination: form.city,
          message: form.message || undefined,
          adults: form.adults ? Number(form.adults) : undefined,
          children: form.children ? Number(form.children) : undefined,
          budget: form.budget || undefined,
          source: 'hotel-assistance',
          hotel_data: {
            city: form.city,
            check_in: form.check_in,
            check_out: form.check_out,
            rooms: Number(form.rooms),
            budget: form.budget,
          },
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      toast({ title: 'Error', description: 'Could not submit. Please call us directly.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center shadow-brand">
        <CheckCircle className="h-14 w-14 text-primary" />
        <h3 className="font-heading text-xl font-semibold text-foreground">Request Received!</h3>
        <p className="max-w-sm text-muted-foreground">
          Thank you! Our team will call you within 2 hours with hotel options matching your requirements.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-brand lg:p-8">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Hotel Assistance Request</h2>
        <p className="mt-1 text-sm text-muted-foreground">Fill in your requirements and we&apos;ll find the best hotels for you.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Your Name *</Label>
          <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Full name" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input id="mobile" type="tel" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} required placeholder="+91 98765 43210" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="city">City / Destination *</Label>
          <Input id="city" value={form.city} onChange={(e) => set('city', e.target.value)} required placeholder="e.g. Tirupati, Ooty" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="check_in">Check-In Date *</Label>
          <Input id="check_in" type="date" value={form.check_in} onChange={(e) => set('check_in', e.target.value)} required min={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="check_out">Check-Out Date *</Label>
          <Input id="check_out" type="date" value={form.check_out} onChange={(e) => set('check_out', e.target.value)} required min={form.check_in || new Date().toISOString().split('T')[0]} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="rooms">Rooms</Label>
          <Select value={form.rooms} onValueChange={(v) => set('rooms', v)}>
            <SelectTrigger id="rooms"><SelectValue /></SelectTrigger>
            <SelectContent>{[1,2,3,4,5].map((n) => <SelectItem key={n} value={String(n)}>{n} Room{n > 1 ? 's' : ''}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="adults">Adults</Label>
          <Select value={form.adults} onValueChange={(v) => set('adults', v)}>
            <SelectTrigger id="adults"><SelectValue /></SelectTrigger>
            <SelectContent>{[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="children">Children</Label>
          <Select value={form.children} onValueChange={(v) => set('children', v)}>
            <SelectTrigger id="children"><SelectValue /></SelectTrigger>
            <SelectContent>{[0,1,2,3,4].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label>Budget per Night</Label>
        <Select value={form.budget} onValueChange={(v) => set('budget', v)}>
          <SelectTrigger><SelectValue placeholder="Select budget range" /></SelectTrigger>
          <SelectContent>{BUDGET_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="message">Special Requirements (optional)</Label>
        <Textarea id="message" value={form.message} onChange={(e) => set('message', e.target.value)} rows={3} placeholder="Any specific requirements, preferences, or special requests..." />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Sending...' : 'Submit Hotel Request'}
      </Button>
    </form>
  );
}
