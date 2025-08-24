"use client"

import { User } from "@supabase/supabase-js"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { createNoteAction } from "@/actions/notes"

type Props = {
  user: User | null
}

export default function NewNoteButton({ user }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleNewNote = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setLoading(true)
    const uuid = uuidv4()

    await createNoteAction(uuid)
      .then(() => {
          toast.success("New note created!")
          router.push(`/?noteId=${uuid}`)
        })
      .catch((error: Error) => {
        console.error("Error creating note:", error)
        toast.error("Failed to create a new note.")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Button
      onClick={handleNewNote}
      disabled={!user || loading}
      variant="outline"
      className="w-26"
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  )
}
