import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import Sidebar from './components/layout/Sidebar';
import ChatView from './components/chat/ChatView';
import NewsDesk from './components/news/NewsDesk';
import PlayerProfile from './components/players/PlayerProfile';
import LiveMatches from './components/live/LiveMatches';
import { useChatManager } from './hooks/useChatManager';
import AuthScreen from './components/auth/AuthScreen';

function AppContent() {
  const navigate = useNavigate();

  const {
    chats,
    activeChatId,
    currentMessages,
    isLoading,
    setActiveChatId,
    handleNewChat,
    handleSendMessage,
    handleDeleteChat
  } = useChatManager();

  return (
    <MainLayout
      sidebarContent={
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={setActiveChatId}
          onDeleteChat={handleDeleteChat}
          onPromptSelect={handleSendMessage}
          onNavigate={(path) => navigate(path)}
        />
      }
      chatContent={
        <Routes>
          <Route path="/" element={
            <ChatView
              messages={currentMessages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          } />

          <Route path="/news" element={<NewsDesk />} />
          <Route path="/players" element={<PlayerProfile />} />
          <Route path="/live" element={<LiveMatches />} />
        </Routes>
      }
    />
  );
}

export default function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <Router>
      {isAuthenticated ? <AppContent /> : <AuthScreen />}
    </Router>
  );
}
