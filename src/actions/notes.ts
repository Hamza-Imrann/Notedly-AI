"use server"

import { getUser } from "@/supabase/server";
import prisma from "../../prisma/prisma";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import openai from "@/openai";

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      errorMessage: error.message,
      user: null,
    };
  }
  return {
    errorMessage: "An unknown error occurred.",
    user: null,
  }
};

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("You must be logged in to create a note.");
    }

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        title: "New Note",
        content: "",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export const updateNoteAction = async (noteId: string, title: string, content: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("You must be logged in to update a note.");
    }

    await prisma.note.update({
      where: { id: noteId, authorId: user.id },
      data: { title, content, updatedAt: new Date() },
    });
  } catch (error) {
    return handleError(error);
  }
}

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("You must be logged in to delete a note.");
    }

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id }
    });
  } catch (error) {
    return handleError(error);
  }
}

export const askAIAction = async (newQuestions: string[], responses: string[]) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("You must be logged in to ask AI about notes.");
    }

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { title: true, content: true, createdAt: true, updatedAt: true }
    })

    if (notes.length === 0) {
      return "Create notes to unlock smart answers and insights with AI."
    }

    const formattedNotes = notes.map((note) =>
      `
        Title: ${note.title}
        Content: ${note.content}
        CreateAt: ${note.createdAt}
        Last Updated: ${note.updatedAt}
      `.trim()
    ).join("\n");

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "developer",
        content: `
            You are a helpful assistant that answers questions about a user's notes. 
            Assume all questions are related to the user's notes. 
            Make sure that your answers are not too verbose and you speak succinctly. 
            Your responses MUST be formatted in clean, valid HTML with proper structure. 
            Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
            Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
            Avoid inline styles, JavaScript, or custom attributes.
            
            Rendered like this in JSX:
            <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
      
            Here are the user's all notes:
            ${formattedNotes}
          `,
      },
    ];

    for (let i = 0; i < newQuestions.length; i++) {
      messages.push({ role: "user", content: newQuestions[i] });
      if (responses.length > i) {
        messages.push({ role: "assistant", content: responses[i] });
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return completion.choices[0].message.content || "A problem has occurred with the AI.";
  } catch (error) {
    return handleError(error);
  }
}