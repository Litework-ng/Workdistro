import { useWebSocketStore } from '@/shared/stores/useWebsocketStore';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly INITIAL_BACKOFF = 1000; // 1s
  private readonly MAX_BACKOFF = 30000;    // 30s cap
  private latestMessageId: string | null = null;
  private manualDisconnect = false;

  private getBackoffDelay() {
    return Math.min(this.INITIAL_BACKOFF * (2 ** this.reconnectAttempts), this.MAX_BACKOFF);
  }

  private async getValidToken(token: string): Promise<string> {
    // 🔑 Stub for token refresh logic
    // Example: check expiry -> refresh -> return new token
    return token;
  }

  async connect(token: string, userType: string) {
    if (!token) {
      console.error('❌ No valid token found.');
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('⚡ WebSocket already connected');
      return;
    }

    // ensure we always use a valid token
    const validToken = await this.getValidToken(token);

    // Build URL with token + role
    const wsUrl = `wss://workdistro-1.onrender.com/ws/notifications/?token=${encodeURIComponent(validToken)}&recipient_type=${encodeURIComponent(userType)}`;

    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
    this.manualDisconnect = false;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log(this.reconnectAttempts > 0 
        ? `✅ WebSocket reconnected after ${this.reconnectAttempts} attempts`
        : '✅ WebSocket connected');

      useWebSocketStore.getState().setIsConnected(true);
      this.reconnectAttempts = 0; // reset on success
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 Incoming WebSocket message:', data);

        if (data.id !== this.latestMessageId) {
          useWebSocketStore.getState().addMessage(data);
          this.latestMessageId = data.id;
        }
      } catch (err) {
        console.error('❌ Failed to parse WebSocket message:', err);
      }
    };

    this.socket.onclose = () => {
      console.log('⚠️ WebSocket closed');
      useWebSocketStore.getState().setIsConnected(false);

      if (!this.manualDisconnect) {
        this.attemptReconnect(token, userType);
      }
    };

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
  }

  private attemptReconnect(token: string, userType: string) {
    const delay = this.getBackoffDelay();
    console.log(`🔄 Attempting reconnection in ${delay / 1000}s (attempt ${this.reconnectAttempts + 1})`);

    setTimeout(() => {
      this.reconnectAttempts += 1;
      this.connect(token, userType);
    }, delay);
  }

  send(payload: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    } else {
      console.warn('⚠️ WebSocket not open, cannot send');
    }
  }

  disconnect() {
    this.manualDisconnect = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();
