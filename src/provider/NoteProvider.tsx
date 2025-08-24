"use client"

import { createContext, useState } from "react"

type NoteProviderContextType = {
  noteText: string
  setNoteText: (noteText: string) => void
  noteTitle: string
  setNoteTitle: (noteTitle: string) => void
}

export const NoteProviderContext = createContext<NoteProviderContextType | undefined>({
  noteTitle: "",
  setNoteTitle: () => {},
  noteText: "",
  setNoteText: () => {}
})

function NoteProvider({ children }: { children: React.ReactNode }) {
  const [noteTitle, setNoteTitle] = useState("")
  const [noteText, setNoteText] = useState("")

  return (
    <NoteProviderContext.Provider value={{ noteTitle, setNoteTitle, noteText, setNoteText }}>
      {children}
    </NoteProviderContext.Provider>
  )
}

export default NoteProvider;