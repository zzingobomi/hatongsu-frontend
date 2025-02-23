import { useChatStore } from "@/app/stores/ChatStore";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { SERVER_NICKNAME } from "@/world/data/const";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ChatInput } from "./ChatInput";

export default function ChatView() {
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

  return (
    <>
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
                <div className="flex flex-col gap-3 pr-3 pb-2">
                  {messages.map((message, index) => {
                    const isServer = message.nickname === SERVER_NICKNAME;
                    const isOwnMessage = message.isMine;

                    return (
                      <div
                        key={index}
                        className={`flex min-w-0 ${
                          isServer
                            ? "justify-center"
                            : isOwnMessage
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] min-w-0 flex flex-col ${
                            isServer ? "items-center w-full" : ""
                          }`}
                        >
                          {!isServer && !isOwnMessage && (
                            <span className="text-xs text-muted-foreground/80 mb-1 ml-1">
                              {message.nickname}
                            </span>
                          )}

                          <div
                            className={`p-3 rounded-2xl text-sm ${
                              isServer
                                ? "bg-gray-200/50 text-gray-600 italic px-4 py-2 text-xs"
                                : isOwnMessage
                                ? "bg-blue-500 text-white rounded-br-sm"
                                : "bg-gray-200 rounded-tl-sm"
                            } whitespace-normal break-words w-full`}
                          >
                            <p>{message.message}</p>
                          </div>

                          <span
                            className={`text-xs text-muted-foreground/60 mt-1 ${
                              isServer
                                ? "text-center"
                                : isOwnMessage
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {formatDistanceToNow(new Date(message.timestamp), {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="p-4 pt-2 bg-border/10 backdrop-blur-sm border-t border-border/20">
                <ChatInput />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
