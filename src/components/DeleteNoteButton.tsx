"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteNoteAction } from "@/actions/notes";

export default function DeleteNoteButton({ noteId, deleteNoteLocally }: { noteId: string; deleteNoteLocally: (id: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const noteIdParam = useSearchParams().get("noteId") || ""

  const handleDeleteNote = () => {
    startTransition(async () => {

      setIsLoading(true)
      const result = await deleteNoteAction(noteId)
      const errorMessage = result?.errorMessage
      
      if (errorMessage) {
        toast.error("Error in deleting note")
      }
      
      else {
        deleteNoteLocally(noteId)
        toast.success("Successfully deleted the note")

        if (noteId === noteIdParam) {
          router.replace("/")
        }
      }
      setIsLoading(false)
    })
  }
  
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 size-7 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3"
          >
            <Trash2 className="text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="w-18 bg-destructive text-destructive-foreground hover:bg-destructive/70" onClick={handleDeleteNote}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Trash2 />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
