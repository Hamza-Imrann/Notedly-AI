import { getUser } from "@/supabase/server"
import prisma from "../../prisma/prisma";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextArea from "@/components/NoteTextArea";

type props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: props) {
  const noteIdParam = (await searchParams).noteId || null
  const user = await getUser()

  const noteId = Array.isArray(noteIdParam) ? noteIdParam![0] : noteIdParam || ""

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id || "",
    },
  })

  return (
    <div className='flex flex-col h-full items-center gap-4'>
      <div className='flex w-full max-w-4xl justify-end gap-2'>
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>
      <NoteTextArea
        noteId={noteId} 
        startingTitle={note?.title || ""}
        startingText={note?.content || ""}
      />
    </div>
  )
}
