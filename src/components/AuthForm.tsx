"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { loginAction, signupAction } from '@/actions/users'

export default function AuthForm({ type }: { type: "login" | "signup" }) {

  const router = useRouter();
  const isLoginForm = type === "login";
  const [isSubmitting, startTransition] = useTransition();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    startTransition(async () => {
      let errorMessage;
      let title;
      let description;
      
      // Login
      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        title = "Logged In";
        description = "You have successfully logged in.";

        if (!email && !password) {
          toast.error("Email and Password are required.", {
            description: "Please enter your email and password to continue.",
          });
          return;
        }

        console.log({ email })
      } 
      
      else { // Signup
        errorMessage = (await signupAction(name, email, password)).errorMessage;
        title = "Signed Up";
        description = "Check your email for verification.";

        console.log({ email })

        if (!email || !password || !name || !confirmPassword) {
          toast.error("All fields are required.", {
            description: "Please fill in all fields before submitting.",
          });
          return;
        }

        if (password.length < 8) {
          toast.error("Password too short", {
            description: "Password must be at least 8 characters long.",
          });
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords does not match.", {
            description: "Please ensure both passwords match.",
          });
          return;
        }

        console.log({ email })
      }

      if (errorMessage) {
        toast.error(errorMessage, {
          description: "Please try again.",
        });
        return;
      }

      toast.success(title, {
        description: description,
      });

      router.replace('/'); // Redirect to home page after successful login/signup
    });
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
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </>
              )}
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
                  name="password"
                  type="password"
                  placeholder='************'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {!isLoginForm && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      placeholder='************'
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
