import { useApi } from './use-api';
import { apiClient } from '@/lib/api-client';

export interface Message {
  Id_message: number;
  content: string;
  send_at: string;
  id_receiver: number;
  id_sender: number;
  sender?: {
    firstname: string;
    lastname: string;
    email: string;
  };
  receiver?: {
    firstname: string;
    lastname: string;
    email: string;
  };
}

export interface Conversation {
  user: {
    id_user: number;
    firstname: string;
    lastname: string;
    email: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export function useMessages() {
  return useApi<Message[]>(() => apiClient.request('/messages/conversations', {
    method: 'GET',
  }));
}

export function useConversations(options?: { enabled?: boolean }) {
  return useApi<Conversation[]>(
    () => apiClient.request('/messages/conversations', {
      method: 'GET',
    }),
    [],
    true,
    options?.enabled !== false
  );
}

export function useMessagesWithUser(userId: number) {
  return useApi<Message[]>(() => apiClient.request(`/messages/${userId}`, {
    method: 'GET',
  }));
}

// Hook pour envoyer un message
export function useSendMessage() {
  return useApi<Message>(() => apiClient.request('/messages', {
    method: 'POST',
  }));
}

// Hook pour marquer un message comme lu
export function useMarkAsRead() {
  return useApi<{ success: boolean }>(() => apiClient.request('/messages', {
    method: 'PUT',
  }));
}
