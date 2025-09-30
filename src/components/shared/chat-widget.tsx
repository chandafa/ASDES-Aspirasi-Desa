"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, X, Loader2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatWithMindes } from "@/ai/flows/chat-mindes";
import { useAuth } from "../providers/auth-provider";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { id: 1, text: `Halo ${user?.displayName || 'Warga'}, saya Mindes! Asisten virtual Aspirasi Desa. Ada yang bisa saya bantu?`, sender: "bot" },
      ]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        const botResponse = await chatWithMindes(input);
        const botMessage: Message = { id: Date.now() + 1, text: botResponse, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error("Error chatting with Mindes:", error);
        const errorMessage: Message = {
            id: Date.now() + 1,
            text: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
            sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-all duration-300", 
        isOpen ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
      )}>
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
          onClick={() => setIsOpen(true)}
          aria-label="Buka Chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      <div
        className={cn(
          "fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-sm transition-all duration-300",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <Card className="flex flex-col h-[70vh] max-h-[70vh] shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Tanya Mindes</CardTitle>
                <CardDescription className="text-xs">Asisten Desa</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Tutup Chat</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender === "bot" && (
                       <Avatar className="h-8 w-8">
                         <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                       </Avatar>
                    )}
                     <div
                      className={cn(
                        "max-w-[80%] rounded-xl px-4 py-2 text-sm",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.text}
                    </div>
                     {message.sender === "user" && user && (
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                         <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                       </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-xl px-4 py-2 flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="relative w-full">
              <Input
                placeholder="Ketik pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSend}
                disabled={isLoading || input.trim() === ""}
                aria-label="Kirim Pesan"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
