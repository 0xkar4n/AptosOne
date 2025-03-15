'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, X, Minimize2 } from 'lucide-react';
import { generateResponse } from '@/lib/gemini';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'sonner';
import { AnimatedBeam } from './ui/animated-beam';
import { ShineBorder } from './ui/shine-border';
import { BorderBeam } from './ui/border-beam';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const {connected} = useWallet();
    
  const [result, setResult] = useState("");

    const { account } = useWallet();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        //@ts-ignore
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        // setResult("");

        try {

            debugger
            if(!connected) {
                toast.error('Please connect your wallet to chat with the AI');
                setIsLoading(false);
                setMessages(messages.filter((_, index) => index !== messages.length));
                return;
            }
            const userWalletAddress = account?.address ? account.address.toString() : "";
            const response = await axios.post('/api/chat', { prompt: input, userWalletAddress: userWalletAddress });
            
            let replyText = "";
            if (typeof response.data.result === "object") {
                replyText = response.data.result.message || JSON.stringify(response.data.result);
            } else {
                replyText = response.data.result;
            }
            if(replyText.includes("Object")) {
                const resArr: string[] = replyText.split(/[.,]/);
                replyText = resArr[1];
            }
            let words = replyText.split(' ');
            let typedMessage = '';

            setMessages((prev) => [...prev, { role: 'assistant', content: words[0]}]);
            setIsLoading(false); // Hide loading dots as soon as AI starts responding

            for (let i = 0; i < words.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 50)); // Typing effect
                typedMessage += (i === 0 ? '' : ' ') + words[i];
            
                setMessages((prev) =>
                    prev.map((msg, index) =>
                        index === prev.length - 1 ? { ...msg, content: typedMessage } : msg
                    )
                );
            
                // Auto-scroll
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Please add some funds to your wallet to chat with the AI');
            setMessages(messages.filter((_, index) => index !== messages.length));
            // console.log(messages);
        } finally {
            setIsLoading(false);
        }
    };


    return (



            <div className="fixed bottom-4 m-10 mb-8 right-4 z-50">
            {!isOpen ? (
                <div className='relative rounded-full'>
                
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="h-14 w-14 rounded-full bg-slate-900 shadow-lg hover:scale-105 transition-transform hover:bg-slate-800"
                >
                    <Bot className="h-6 w-6 text-white" />
                </Button>
                <BorderBeam
              size={30}
              initialOffset={20}
              delay={0.001}
              className="from-transparent via-yellow-500 to-transparent"
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 20,
              }}
            />
                </div>
            ) : (
                <Card className={cn(
                    "w-[380px] h-[600px] flex flex-col",
                    "transform transition-all duration-300 ease-in-out shadow-lg",
                    isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                <Bot className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h2 className="font-semibold">AI Assistant</h2>
                                <p className="text-xs text-muted-foreground">Powered by Gemini</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 hover:bg-muted"
                                title="Minimize"
                            >
                                <Minimize2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setIsOpen(false);
                                    setMessages([]);
                                    setInput('');
                                }}
                                className="h-8 w-8 hover:bg-muted"
                                title="Close chat"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                <MessageCircle className="h-12 w-12 text-muted-foreground" />
                                <p className="text-lg text-muted-foreground">
                                    How can I help you today?
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                                }`}
                                        >
                                            <div
    className={`max-w-[80%] break-words rounded-lg p-3 ${
        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
    }`
    
    }style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} 
>
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                                                <div className="flex space-x-2">
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        )}
                    </ScrollArea>

                    <form onSubmit={handleSubmit} className="p-4 border-t flex space-x-2">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </Card>
            )}
        </div>
        // </AnimatedBeam>
        
    );
}