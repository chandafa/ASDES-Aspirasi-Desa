"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { chatWithMindes } from '@/ai/flows/chat-mindes';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const question = input;
        const userMessage: Message = { role: 'user', content: question };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const assistantResponse = await chatWithMindes(question);
            const assistantMessage: Message = { role: 'assistant', content: assistantResponse };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error chatting with Mindes:', error);
            const errorMessage: Message = { role: 'assistant', content: 'Maaf, sepertinya ada sedikit masalah. Coba tanyakan lagi nanti ya.' };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                         <Button
                            size="icon"
                            className="rounded-full w-14 h-14 shadow-lg"
                            aria-label="Buka Chat Bantuan"
                        >
                            <Bot className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full max-w-md p-0 flex flex-col">
                        <SheetHeader className='p-4 border-b'>
                            <SheetTitle className='flex items-center gap-2'>
                                <Bot />
                                Tanya Mindes (Asisten Desa)
                            </SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted p-3 rounded-lg max-w-xs">
                                        <p className="text-sm">Halo! Saya Mindes, asisten virtual Anda. Ada yang bisa saya bantu seputar website Aspirasi Desa?</p>
                                    </div>
                                </div>

                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                                    >
                                        {msg.role === 'assistant' && (
                                             <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                                <AvatarFallback><Bot size={20} /></AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                         {msg.role === 'user' && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback><User size={20} /></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                     <div className="flex items-start gap-3">
                                         <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                            <AvatarFallback><Bot size={20} /></AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted p-3 rounded-lg max-w-xs flex items-center">
                                           <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t">
                            <div className="relative">
                                <Input
                                    placeholder="Ketik pertanyaan Anda..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                    className="pr-12"
                                />
                                <Button
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
