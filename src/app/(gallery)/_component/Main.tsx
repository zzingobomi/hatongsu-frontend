"use client";

import { World } from "@/world";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useChatStore } from "@/app/stores/ChatStore";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Main() {
  const worldRef = useRef<World>(null);
  const { isChatOpen, toggleChat, unreadCount, incrementUnread } =
    useChatStore();
  const messages = useChatStore((state) => state.messages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (scrollElement) {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      incrementUnread();
    }
  }, [messages.length]);

  useEffect(() => {
    (async () => {
      const { World } = await import("@/world");
      worldRef.current = new World();
    })();
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 relative">
      <canvas id="world-canvas" className="w-full h-full"></canvas>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <div className="absolute bottom-4 right-4 animate-fade-in-up">
          <Button
            variant="default"
            size="lg"
            className="rounded-full h-14 w-14 shadow-xl relative"
            onClick={toggleChat}
          >
            <MessageSquare className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 animate-pulse"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Expandable Chat Container */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="chat-container"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-4 right-4 origin-bottom-right"
          >
            <Card className="w-80 h-[480px] flex flex-col bg-background/90 backdrop-blur-sm border-0 shadow-xl">
              {/* Header with close button */}
              <div className="p-4 pb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Chat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={toggleChat}
                >
                  ✕
                </Button>
              </div>

              <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                <div className="flex flex-col gap-4 pr-3 pb-2">
                  {messages.map((message, index) => (
                    <div key={index} className="group flex gap-3">
                      {/* <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {message.sessionId.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar> */}

                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-primary">
                            User_{message.sessionId.slice(-4)}
                          </span>
                          {/* <span className="text-xs text-muted-foreground/80">
                      {format(new Date(message.timestamp), "HH:mm")}
                    </span> */}
                        </div>
                        <p className="mt-1 text-sm text-foreground/90 leading-snug p-2 bg-muted/20 rounded-lg">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 pt-2 bg-border/10 backdrop-blur-sm border-t border-border/20">
                <ChatInput />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
