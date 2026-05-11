import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
const CHAT_API = PROJECT_ID
  ? `https://${PROJECT_ID}.supabase.co/functions/v1/xenium-chat`
  : "/functions/v1/xenium-chat";

const QUICK_PROMPTS = [
  "How fast can I get it?",
  "What's included for ₹750?",
  "Is it private?",
  "How do refunds work?",
];

const WELCOME: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text:
        "Hi! I'm **Ask Xenium**. I can answer anything about pricing, delivery, the process, privacy or how to start an order. What would you like to know?",
    },
  ],
};

function partsToText(parts: UIMessage["parts"]): string {
  return parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const transportRef = useRef(new DefaultChatTransport({ api: CHAT_API }));
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: "xenium-faq-bot",
    messages: [WELCOME],
    transport: transportRef.current,
  });

  const isBusy = status === "submitted" || status === "streaming";

  // Focus textarea when opening, after sending and after stream completes.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (open && status === "ready") inputRef.current?.focus();
  }, [status, open]);

  // Autoscroll to newest message.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Esc closes panel.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        aria-label={open ? "Close Xenium chat" : "Open Xenium chat"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 bottom-5 right-5 sm:bottom-6 sm:right-6 w-14 h-14 rounded-full gradient-full text-foreground shadow-[0_15px_40px_-10px_hsl(var(--xenium-violet-deep)/0.8)] hover:scale-105 transition-transform flex items-center justify-center"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Ask Xenium chat"
          className="fixed z-50 bottom-24 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-24 sm:w-[380px] max-h-[min(640px,80vh)] flex flex-col rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_hsl(var(--xenium-violet-deep)/0.6)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/40 bg-gradient-to-r from-xenium-violet-deep/15 via-xenium-rose/10 to-transparent flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-full flex items-center justify-center">
              <Sparkles size={15} className="text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-foreground leading-tight">Ask Xenium</p>
              <p className="text-[11px] text-muted-foreground/80">Replies in seconds · usually right</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground/70 hover:text-foreground transition-colors p-1 rounded-md"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m) => {
              const text = partsToText(m.parts);
              if (!text) return null;
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {isUser ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-3.5 py-2 text-sm leading-relaxed">
                      {text}
                    </div>
                  ) : (
                    <div className="max-w-[90%] text-foreground/90 text-sm leading-relaxed prose-chat">
                      <ReactMarkdown
                        components={{
                          p: ({ node: _n, ...p }) => <p className="mb-2 last:mb-0" {...p} />,
                          strong: ({ node: _n, ...p }) => (
                            <strong className="text-foreground font-semibold" {...p} />
                          ),
                          ul: ({ node: _n, ...p }) => (
                            <ul className="list-disc pl-4 my-2 space-y-0.5" {...p} />
                          ),
                          ol: ({ node: _n, ...p }) => (
                            <ol className="list-decimal pl-4 my-2 space-y-0.5" {...p} />
                          ),
                          a: ({ node: _n, ...p }) => (
                            <a
                              className="text-xenium-amber underline-offset-2 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...p}
                            />
                          ),
                          code: ({ node: _n, ...p }) => (
                            <code
                              className="rounded bg-muted/40 px-1.5 py-0.5 text-[12px] text-foreground"
                              {...p}
                            />
                          ),
                        }}
                      >
                        {text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })}

            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/80">
                  <Loader2 size={12} className="animate-spin text-xenium-amber" />
                  <span className="italic">Thinking…</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-xenium-rose/90 bg-xenium-rose/10 border border-xenium-rose/30 rounded-lg p-2.5">
                Something went wrong. Please try again, or email{" "}
                <a className="underline" href="mailto:xeniumgifts@gmail.com">
                  xeniumgifts@gmail.com
                </a>
                .
              </div>
            )}
          </div>

          {/* Quick prompts (only before user has sent anything) */}
          {messages.length <= 1 && (
            <div className="px-3 pb-1.5 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submit(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-xenium-violet-mid/50 hover:bg-muted/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="border-t border-border/40 p-3 flex items-end gap-2 bg-background"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask about pricing, delivery, refunds…"
              disabled={isBusy}
              className="flex-1 resize-none max-h-32 bg-muted/20 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20 disabled:opacity-60"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={isBusy || !input.trim()}
              className="shrink-0 w-10 h-10 rounded-xl gradient-full text-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
