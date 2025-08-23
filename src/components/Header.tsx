import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/DarkModeToggle";
import LogoutButton from "@/components/LogoutButton";
import { getUser } from "@/supabase/server";

export default async function Header() {
  const user = await getUser();

  return (
    <header
      className="relative flex h-24 w-full items-center justify-between bg-popover px-3 sm:px-8 shadow-sm"
    >
      <Link href="/">
        <Image
          alt="Notedly-AI Logo"
          src="/icon.png"
          height={60}
          width={60}
          className="rounded-full"
          priority
        />
      </Link>

      <div className="flex items-center gap-4">
        <ModeToggle />
        {
          user ? (
            <LogoutButton />
          ) : (
            <>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )
        }
      </div>
    </header>
  )
}
