"use client"

import { useSearchParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent, useEffect } from "react"
import { debounceTimeout } from "@/lib/constents"
import useNote from "@/hooks/useNote"
import { Input } from "./ui/input"
import { updateNoteAction } from "@/actions/notes"

type Props = {
  noteId: string
  startingTitle: string
  startingText: string
}

let updateTimer: NodeJS.Timeout;

export default function NoteTextArea({ noteId, startingTitle, startingText }: Props) {
  const noteIdParam = useSearchParams().get("noteId") || ""
  const {noteTitle, setNoteTitle, noteText, setNoteText } = useNote()

  useEffect(() => {
    if (noteIdParam === noteId) {
      setNoteTitle(startingTitle)
      setNoteText(startingText)
    }
  }, [noteId, noteIdParam, setNoteText, startingText, setNoteTitle, startingTitle])

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setNoteTitle(newTitle)

    clearTimeout(updateTimer)
    updateTimer = setTimeout(() => {
      updateNoteAction(noteId, newTitle, noteText)
    }, debounceTimeout)
  }

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setNoteText(newContent)

    clearTimeout(updateTimer)
    updateTimer = setTimeout(() => {
      updateNoteAction(noteId, noteTitle, newContent)
    }, debounceTimeout)
  }

  return (
    <>
      <Input
        value={noteTitle}
        onChange={handleTitleChange}
        placeholder="Note Title"
        className="mb-1 mt-4 w-full border-0 bg-transparent p-5 text-2xl font-bold outline-none focus:ring-0 placeholder:text-muted-foreground sm:text-xl"
      />

      <Textarea
        value={noteText}
        onChange={handleUpdateNote}
        placeholder="Start writing your note..."
        className="h-full w-full max-w-4xl flex-1 resize-none border-0 bg-transparent p-5 mb-4 text-lg outline-none focus:ring-0 placeholder:text-muted-foreground sm:text-base"
      />
    </>
  )
}
