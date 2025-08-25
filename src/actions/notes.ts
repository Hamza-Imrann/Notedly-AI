"use server"

import { getUser } from "@/supabase/server";
import prisma from "../../prisma/prisma";

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