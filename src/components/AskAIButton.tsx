"use client"

import { User } from "@supabase/supabase-js"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React, { Fragment, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "./ui/textarea"
import { ArrowUpIcon } from "lucide-react"
import { askAIAction } from "@/actions/notes"
import "@/styles/ai-response.css"

type Props = {
  user: User | null
}

export default function AskAIButton({ user }: Props) {
  const [open, setOpen] = useState(false)
  const [questionText, setQuestionText] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [responses, setResponses] = useState<string[]>([])
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleOpenChange = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (open) {
      setQuestionText("")
      setQuestions([])
      setResponses([])
    }
    setOpen((prev) => !prev)
  }

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleInput = () => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  const handleClickInput = () => {
    textAreaRef.current?.focus();
  }

  const handleSubmit = () => {
    if (!questionText.trim()) return;
    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAction(newQuestions, responses);
      const responseText =
        typeof response === "string"
          ? response
          : response?.errorMessage
            ? response.errorMessage
            : "An unknown error occurred.";
      setResponses((prev) => [...prev, responseText]);

      setTimeout(scrollToBottom, 100);
    })
  }

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth"
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Ask AI</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] flex h-[85vh] max-w-4xl flex-col overflow-y-auto" ref={contentRef}>
          <DialogHeader>
            <DialogTitle>Ask AI About Your Notes.</DialogTitle>
            <DialogDescription>
              Have a question about your notes? Just ask — the AI will respond using your saved content.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-8">
            {questions.map((question, index) => (
              <Fragment key={index}>
                <p
                  className="ml-auto max-w-[60%] rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground"
                >
                  {question}
                </p>
                {responses[index] && (
                  <p
                    className="bot-response text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: responses[index] }}
                  />
                )}
              </Fragment>
            ))}
            {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
          </div>

          <div
            className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
            onClick={handleClickInput}
          >
            <Textarea
              ref={textAreaRef}
              placeholder="Ask me anything about your notes..."
              className="resize-none rounded-none border-none bg-transparent p-0 shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{
                minHeight: "0",
                lineHeight: "normal",
              }}
              rows={1}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <Button className="ml-auto size-8 rounded-full">
              <ArrowUpIcon className="text-background" />
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
