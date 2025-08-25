"use client";

import { Note } from "@/generated/prisma";
import useNote from "@/hooks/useNote";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';

export default function SelectNoteButton({ note }: { note: Note }) {
  const noteId = useSearchParams().get("noteId") || ""

  const {noteTitle: selectedNoteTitle} = useNote()
  const [localNoteTitle, setLocalNoteTitle] = useState(note.title)
  const [shouldUseGlobalText, setShouldUseGlobalText] = useState(false)

  useEffect(() => {
    if (noteId === note.id) {
      setShouldUseGlobalText(true)
    }
    else {
      setShouldUseGlobalText(false)
    }
  }, [noteId, note.id])

  useEffect(() => {
    if (shouldUseGlobalText) {
      setLocalNoteTitle(selectedNoteTitle)
    }
  }, [selectedNoteTitle, shouldUseGlobalText])

  const blankNoteText = "EMPTY NOTE"
  let noteTitle = localNoteTitle || blankNoteText

  if (shouldUseGlobalText) {
    noteTitle = selectedNoteTitle || blankNoteText
  }

  return (
    <>
      <SidebarMenuButton
        asChild
        className={`items-start gap-0 pr-12 ${note.id === noteId && "bg-sidebar-accent/50"}`}
      >
        <Link
          href={`/?noteId=${note.id}`}
          className="flex h-fit flex-col"
        >
          <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">
            {shouldUseGlobalText ? (selectedNoteTitle || "Untitled Note") : (note.title || "Untitled Note")}
          </p>
          <p className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
          </p>
        </Link>
      </SidebarMenuButton>
    </>
  )
}
