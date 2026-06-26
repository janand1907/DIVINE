'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader as Loader2, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AcceptInvitePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'used'>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/auth/validate-invite?code=${params.code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setStatus('valid');
          if (data.email_hint) setEmail(data.email_hint);
        } else if (data.used) {
          setStatus('used');
        } else {
          setStatus('invalid');
        }
      })
      .catch(() => setStatus('invalid'));
  }, [params.code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: params.code, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Registration failed'); return; }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error('Account created but sign-in failed. Please go to /admin/login.'); return; }
      toast.success('Account created! Welcome.');
      router.push('/admin');
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'invalid' || status === 'used') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="font-heading text-xl font-bold text-foreground">
            {status === 'used' ? 'Invite Already Used' : 'Invalid Invite Link'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {status === 'used'
              ? 'This invite link has already been used. Please request a new one.'
              : 'This invite link is invalid or has expired. Please request a new one.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h1 className="font-heading text-2xl font-bold text-foreground">Create Admin Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">You have been invited to join the admin panel.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-brand">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
