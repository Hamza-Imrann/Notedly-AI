'use client'

import { forgotPasswordAction } from '@/actions/users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [waitTime, setWaitTime] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSubmitting, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const TIMEOUT_DURATION = 60000; // 60 seconds

  const handleSubmit = async () => {
    startTransition(async () => {
      if (!email) {
        toast.error("Email is required.", {
          description: "Please enter your email to continue.",
        });
        return;
      }

      const errorMessage = (await forgotPasswordAction(email)).errorMessage;

      if (errorMessage) {
        toast.error("Login Failed", {
          description: "Please check your credentials and try again.",
          action: {
            label: "Retry",
            onClick: () => handleSubmit(),
          },
        })
      } else {
        setSent(true)
        toast.success("Password reset email sent", {
          description: "Please check your inbox and spam folder",
        })
        setWaitTime(true)
        setRemainingTime(TIMEOUT_DURATION / 1000);

        const interval = setInterval(() => {
          setRemainingTime(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setWaitTime(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    })
  }

  return (
    <div className='flex items-center justify-center pb-10' style={{ minHeight: 'calc(100vh - 10rem)' }}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-[18px]'>
            {sent ? "Check your email for a reset link" : "Forgot your password?"}
          </CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            {sent ? "Please check your inbox and spam folder" : "Enter your email below to get a password reset link"}
          </CardDescription>
        </CardHeader>

        <form action={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className='mt-7 flex-col gap-2'>
            <Button type="submit" disabled={isSubmitting || waitTime} className='w-full'>
              {isSubmitting ? <Loader2 className='animate-spin' /> :  (sent ? 
                (
                  waitTime
                  ? `Please wait ${remainingTime}s`
                  : "Resend Link"
                ) 
                : "Send Reset Link")}
            </Button>
            {sent && <div className='text-center text-sm text-muted-foreground'>
              <span>
                Wait a few minutes if you don't see the email. If you still don't see it try again.
              </span>
            </div>}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}