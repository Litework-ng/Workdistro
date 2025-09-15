// shared/stores/useWebsocketStore.ts
import { create } from 'zustand';

export interface WebSocketMessage {
  type: 'NEW_APPLICATION' | 'STATUS_UPDATE' | string;
  content?: string;
  [key: string]: any;
}

export interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  messages: WebSocketMessage[];
  userType: string | null;
  setUserType: (type: string) => void;
  connect: (token: string, role: string) => void;
  disconnect: () => void;
  addMessage: (msg: WebSocketMessage) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],
  userType: null,

  setUserType: (type) => set({ userType: type }),

  connect: (token, role) => {
    if (get().isConnected) return;

    const wsUrl = `wss://your-api.com/ws?token=${token}&role=${role}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      set({ isConnected: true });
      console.log('✅ WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        get().addMessage(data);
      } catch (err) {
        console.error('Invalid WebSocket message', err);
      }
    };

    socket.onclose = () => {
      set({ isConnected: false, socket: null });
      console.log('⚠️ WebSocket disconnected');
    };

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },

  addMessage: (msg) => {
    set((state) => ({
      messages: [...state.messages, msg],
    }));
  },
}));
