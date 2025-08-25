import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";

  const { id } = await prisma.note.create({
    data: {
      authorId: userId,
      title: "Welcome to Notedly-AI.",
      content: `This is your first note. 🎉

Here's how to get started:

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

Happy writing ✍️ — Notedly-AI has your back!`
    }
  });

  return NextResponse.json({
    noteId: id
  })
}