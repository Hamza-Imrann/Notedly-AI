import { getUser } from "@/supabase/server"
import prisma from "../../prisma/prisma";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextArea from "@/components/NoteTextArea";
import { redirect } from "next/navigation";

type props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: props) {
  const noteIdParam = (await searchParams).noteId || null
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }
  
  const noteId = Array.isArray(noteIdParam) ? noteIdParam![0] : noteIdParam || ""

  if (!noteId) {
    // No noteId, fetch newest note or create a new one
    const newestNote = await prisma.note.findFirst({
      where: { authorId: user?.id },
      orderBy: { createdAt: "desc" },
    })

    if (newestNote) {
      redirect(`/?noteId=${newestNote.id}`)
    } else {
      // Create a new note
      const newNote = await prisma.note.create({
        data: {
          authorId: user.id,
          title: "Welcome to Notedly-AI.",
      content: `This is your first note. 🎉

Here's how to get started with Notedly AI:

- Click the "New Note" button to create a new note.
- Your notes will appear in the sidebar on the left.
- Click any note to open and edit it.
- Type in the title or the content box — your changes are automatically saved in real-time. 💾

No save button needed. Just type and go!

🧠 **Ask AI**

Use the "Ask AI" button to get help or insights based on your notes.

- The AI knows what's in your notes.
- You can ask it questions, get summaries, or brainstorm ideas.
- It's like having a smart assistant for everything you’ve written.

Happy writing ✍️ — Notedly-AI has your back!`,
        },
      })
      redirect(`/?noteId=${newNote.id}`)
    }
  }

  // If noteId exists, fetch that note
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user.id,
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
