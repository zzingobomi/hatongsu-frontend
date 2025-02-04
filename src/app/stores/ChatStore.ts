import { create } from "zustand";
import { ESChatMessage } from "@/world/shared/eventserver.type";

interface ChatState {
  // Chat messages
  messages: ESChatMessage[];
  addMessage: (message: ESChatMessage) => void;
  clearMessages: () => void;

  // Chat state
  isChatOpen: boolean;
  unreadCount: number;
  toggleChat: () => void;
  incrementUnread: () => void;
  resetUnread: () => void;

  // Send message
  pendingMessage: string;
  sendMessage: (message: string) => void;
}

const MAX_MESSAGES = 50;

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message].slice(-MAX_MESSAGES),
    })),
  clearMessages: () => set({ messages: [] }),

  isChatOpen: false,
  unreadCount: 0,
  toggleChat: () =>
    set((state) => {
      const newState = !state.isChatOpen;
      return {
        isChatOpen: newState,
        unreadCount: newState ? 0 : state.unreadCount,
      };
    }),
  incrementUnread: () =>
    set((state) => ({
      unreadCount: state.isChatOpen ? 0 : state.unreadCount + 1,
    })),
  resetUnread: () => set({ unreadCount: 0 }),

  pendingMessage: "",
  sendMessage: (message) => set({ pendingMessage: message }),
}));
