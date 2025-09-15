import { useEffect, useRef } from 'react';
import { useWebSocketStore } from '@/shared/stores/useWebsocketStore';
import Toast from 'react-native-toast-message';

export const useWebSocketEvents = () => {
  const { messages } = useWebSocketStore();
  const lastMessageCount = useRef(messages.length);

  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      const newMessages = messages.slice(lastMessageCount.current);
      lastMessageCount.current = messages.length;

      newMessages.forEach((msg) => {
        if (msg.type === 'NEW_APPLICATION') {
          Toast.show({
            type: 'info',
            text1: 'New Application',
            text2: msg.content || 'You have a new application!',
          });
        }

        if (msg.type === 'STATUS_UPDATE') {
          Toast.show({
            type: 'success',
            text1: 'Status Updated',
            text2: msg.content || 'Your status has been updated!',
          });
        }
      });
    }
  }, [messages]);

  return null; // purely for side effects
};
