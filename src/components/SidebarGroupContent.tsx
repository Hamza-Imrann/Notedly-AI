"use client"
import { Note } from "@/generated/prisma";
import { SidebarGroupContent as SidebarGroupContentShadCN, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Delete, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";

export default function SidebarGroupContent({ notes }: { notes: Note[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["title", "content"],
      threshold: 0.4,
    });
  }, [localNotes]);

  const filteredNotes = searchQuery
    ? fuse.search(searchQuery).map(result => result.item)
    : localNotes;

  return (
    <SidebarGroupContentShadCN>
      <div className="relative mt-2 flex items-center">
        <SearchIcon className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search notes..."
          className="w-full pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <SidebarMenu className="mt-4" aria-label="Notes">
        {filteredNotes.map((note) => (
          <SidebarMenuItem
            key={note.id}
            // href={`/notes/${note.id}`}
            className="group/item"
          >
            <SelectNoteButton note={note} />
            <DeleteNoteButton
              noteId={note.id}
              deleteNoteLocally={(id: string) => setLocalNotes((prev) => prev.filter((n) => n.id !== id))}
            />
          </SidebarMenuItem>
        ))}
        {filteredNotes.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">
            No notes found.
          </div>
        )}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  )
}