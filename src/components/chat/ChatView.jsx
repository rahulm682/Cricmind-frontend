import React from 'react';
import ChatArena from './ChatArena';
import ChatInput from './ChatInput';

const ChatView = ({ messages, isLoading, onSendMessage }) => {
  return (
    <div className="h-full flex flex-col relative">
      <ChatArena messages={messages} isLoading={isLoading} />

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-6 pb-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatView;
