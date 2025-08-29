"use client"
import { logoutAction } from '@/actions/users'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { useState } from 'react'
import { toast } from "sonner"

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const { errorMessage } = await logoutAction();

    if (errorMessage) {
      toast.error("Logout Failed", {
        description: "Please try again",
        action: {
          label: "Retry",
          onClick: () => handleLogout(),
        },
      })
    } else {
      toast("Logout successful.")
    }
    
    setLoading(false);
  };

  return (
    <Button
      className='w-10'
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? <Loader2 className='animate-spin' /> : <LogOut />}
    </Button>
  )
}
