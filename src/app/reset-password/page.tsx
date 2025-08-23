'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { resetPasswordAction } from '@/actions/users'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isSubmitting, startTransition] = useTransition();
  const router = useRouter()

  const handleSubmit = async () => {
    startTransition(async () => {
      if (!password) {
        toast.error("Password is required.", {
          description: "Please enter new password to continue.",
        });
        return;
      }

      if (password.length < 8) {
        toast.error("Password too short", {
          description: "Password must be at least 8 characters long.",
        });
        return;
      }

      if (password !== confirm) {
        toast.error("Passwords do not match");
        return;
      }

      const errorMessage = (await resetPasswordAction(password)).errorMessage;

      if (errorMessage) {
        toast.error("Reset Password Failed", {
          description: "Please try again.",
          action: {
            label: "Retry",
            onClick: () => handleSubmit(),
          },
        })
        return;
      } else {
        toast.success("Password reset successful", {
          description: "You can now log in with your new password.",
        })
        router.replace('/login')
      }
    })
  }

  return (
    <div className='flex items-center justify-center pb-10' style={{ minHeight: 'calc(100vh - 10rem)' }}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-[18px]'>Reset Your Password</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Enter your new password below to reset your password
          </CardDescription>
        </CardHeader>

        <form action={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="************"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="************"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className='mt-7 flex-col gap-2'>
            <Button type="submit" disabled={isSubmitting} className='w-full'>
              {isSubmitting ? <Loader2 className='animate-spin' /> : "Update Password"}
            </Button>
            <div className='text-center text-sm text-muted-foreground'>
              <span>Make sure your new password is at least 8 characters long.</span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
