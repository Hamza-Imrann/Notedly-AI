import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Note } from "@/generated/prisma"
import { getUser } from "@/supabase/server"
import prisma from "../../prisma/prisma"
import SidebarGroupContent from "@/components/SidebarGroupContent"

export async function AppSidebar() {
  const user = await getUser()
  let notes: Note[] = []

  if (user) {
    // Fetch notes for the authenticated user
    await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    })
      .then((fetchedNotes) => {
        notes = fetchedNotes
      })
      .catch((error) => {
        console.error("Error fetching notes:", error)
      })
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold">
            {user ? `Notes (${notes.length})` : "Log in to see your notes"}
          </SidebarGroupLabel>
          { user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}