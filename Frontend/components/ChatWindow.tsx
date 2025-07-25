"use client";

import { useState, useEffect } from "react";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";

type MessageType = {
  id: string;
  sender: "provider" | "consumer";
  text: string;
  timestamp: Date;
};

export default function ChatWindow({
  userType,
}: {
  userType: "provider" | "consumer";
}) {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    // Mock initial messages
    setMessages([
      {
        id: "1",
        sender: "consumer",
        text: "Hello, I need help with my order",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        sender: "provider",
        text: "How can I assist you today?",
        timestamp: new Date(Date.now() - 1800000),
      },
    ]);
  }, []);

  const handleSend = (text: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      sender: userType,
      text,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="h-full flex flex-col border rounded-lg bg-white">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-semibold">
          Chat with {userType === "provider" ? "Consumer" : "Provider"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isCurrentUser={message.sender === userType}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
