"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

export default function AuthForm({ type }: { type: "login" | "signup" }) {

  const router = useRouter();
  const isLoginForm = type === "login";
  const [isSubmitting, startSubmitting] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()

    console.log({ email, password })
  }

  return (
    <div className='flex items-center justify-center pb-10' style={{ minHeight: 'calc(100vh - 10rem)' }}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-[18px]'>{isLoginForm ? "Welcome Back" : "Create your Notedly-AI account" }</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Enter your credential below to {type}
          </CardDescription>
        </CardHeader>

        <form action={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {!isLoginForm && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLoginForm && (
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder='************'
                  required
                  disabled={isSubmitting}
                />
              </div>
              {!isLoginForm && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder='************'
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-7">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  isLoginForm ? "Login" : "Create Account"
                )
              }
            </Button>

            <div className='text-center text-sm text-muted-foreground'>
              {
                isLoginForm ? (
                  <span>
                    New to Notedly-AI?{" "}
                    <Link href="/signup" className="underline hover:underline">
                      Sign Up
                    </Link>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <Link href="/login" className="underline hover:underline">
                      Login
                    </Link>
                  </span>
                )
              }
            </div>
          </CardFooter>
        </form>

      </Card>
    </div>
  )
}
