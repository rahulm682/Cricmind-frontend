import { useState, useEffect } from 'react';
import {
  useAskAiMutation,
  useGetChatsQuery,
  useSaveChatMutation,
  useDeleteChatMutation
} from '../services/cricketApi';

export const useChatManager = () => {
  const { data: fetchedChats, isLoading: isFetchingChats } = useGetChatsQuery();
  const [saveChat] = useSaveChatMutation();
  const [deleteChatMutation] = useDeleteChatMutation();
  const [askAi, { isLoading: isAiGenerating }] = useAskAiMutation();

  const [chats, setChats] = useState([]);

  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem('cricmind_active_chat') || null;
  });

  useEffect(() => {
    if (fetchedChats) {
      setChats(fetchedChats);
    }
  }, [fetchedChats]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem('cricmind_active_chat', activeChatId);
    } else {
      localStorage.removeItem('cricmind_active_chat');
    }
  }, [activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const currentMessages = activeChat ? activeChat.messages : [];

  const handleNewChat = () => {
    setActiveChatId(null);
  };

  const handleDeleteChat = async (chatIdToDelete) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatIdToDelete));
    if (activeChatId === chatIdToDelete) {
      setActiveChatId(null);
    }

    try {
      await deleteChatMutation(chatIdToDelete).unwrap();
    } catch (error) {
      console.error("Failed to delete chat from database", error);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || isAiGenerating) return;

    let currentId = activeChatId;
    let updatedChats = [...chats];
    let chatTitle = "";

    if (!currentId) {
      currentId = Date.now().toString();
      chatTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      const newChat = { id: currentId, title: chatTitle, messages: [] };
      updatedChats = [newChat, ...updatedChats];
      setActiveChatId(currentId);
    } else {
      chatTitle = updatedChats.find(c => c.id === currentId).title;
    }

    const chatIndex = updatedChats.findIndex(c => c.id === currentId);
    const newMessagesList = [...updatedChats[chatIndex].messages, { role: 'user', content: text }];
    updatedChats[chatIndex] = { ...updatedChats[chatIndex], messages: newMessagesList };
    setChats(updatedChats);

    try {
      const response = await askAi({ question: text, history: newMessagesList }).unwrap();

      const finalMessages = [...newMessagesList, {
        role: 'ai',
        content: response.answer,
        data: response.data,
        sql_used: response.sql_used,
        cached_via: response.cached_via
      }];

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === currentId) {
          return { ...chat, messages: finalMessages };
        }
        return chat;
      }));

      await saveChat({
        id: currentId,
        title: chatTitle,
        messages: finalMessages
      }).unwrap();

    } catch (error) {
      console.error("AI Generation Failed:", error);
      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === currentId) {
          return { ...chat, messages: [...newMessagesList, { role: 'ai', content: error?.data?.error || "Connection to AI failed." }] };
        }
        return chat;
      }));
    }
  };

  return {
    chats,
    activeChatId,
    currentMessages,
    // Show loading spinner if fetching initial DB load OR waiting for AI
    isLoading: isAiGenerating || isFetchingChats,
    setActiveChatId,
    handleNewChat,
    handleSendMessage,
    handleDeleteChat
  };
};