"use client"

import { User } from "@supabase/supabase-js"

type Props = {
  user: User | null
}

export default function AskAIButton({ user }: Props) {
  return (
    <div>AskAIButton</div>
  )
}
