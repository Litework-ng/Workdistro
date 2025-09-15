// shared/stores/useWebSocketStore.ts
import { create } from 'zustand';

export interface WebSocketMessage {
  type: string;
  content?: string;
  id?: string;
  [key: string]: any;
}

export interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  messages: WebSocketMessage[];
  userType: string | null;

  setIsConnected: (value: boolean) => void;
  setUserType: (type: string) => void;
  addMessage: (msg: WebSocketMessage) => void;
  clearMessages: () => void;

  connect: (token: string, roleType: string) => void; // ✅ Added
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],
  userType: null,

  setIsConnected: (value) => set({ isConnected: value }),
  setUserType: (type) => set({ userType: type }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
  clearMessages: () => set({ messages: [] }),

  connect: (token, roleType) => {
    const wsUrl = `wss://workdistro-1.onrender.com/ws/notifications/?token=${token}&role=${roleType}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      set({ isConnected: true, socket, userType: roleType });
      console.log('✅ WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      get().addMessage(data);
    };

    socket.onclose = () => {
      set({ isConnected: false, socket: null });
      console.log('❌ WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('⚠️ WebSocket error', error);
    };
  },
}));
