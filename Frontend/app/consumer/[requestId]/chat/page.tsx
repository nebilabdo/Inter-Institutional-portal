"use client";
import type React from "react";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Message } from "@/types/chat"; // Assuming Message type is defined in types/chat.ts

export default function ConsumerRequestChatPage() {
  const params = useParams();
  const requestId = params.requestId as string;

  // Mock messages for the specific request ID
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Simulate fetching messages for the specific requestId
    // In a real app, you would fetch from your backend here
    const mockMessages: Message[] = [
      {
        id: "msg1",
        senderId: "provider-ministry-of-education",
        senderName: "Ministry of Education",
        content: `Hello! Regarding your request #${requestId} for Student Enrollment Data API. We have approved it.`,
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isUser: false,
      },
      {
        id: "msg2",
        senderId: "consumer-user",
        senderName: "You",
        content:
          "Great! Thank you for the quick approval. Where can I find the API documentation?",
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
        isUser: true,
      },
      {
        id: "msg3",
        senderId: "provider-ministry-of-education",
        senderName: "Ministry of Education",
        content:
          "You can find the documentation at [link-to-docs.com]. Let us know if you have any further questions.",
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
        isUser: false,
      },
    ];
    setMessages(mockMessages);
  }, [requestId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: "consumer-user",
        senderName: "You",
        content: input,
        timestamp: new Date().toISOString(),
        isUser: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
      // In a real app, you would send this message to your backend
    }
  };

  return (
    <DashboardLayout userRole="consumer">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Conversation for Request #{requestId}</CardTitle>
          </CardHeader>
          <CardContent className="h-[60vh] flex flex-col">
            <MessageList messages={messages} />
            <div className="mt-4">
              <MessageInput
                input={input}
                handleInputChange={(e) => setInput(e.target.value)}
                handleSubmit={handleSendMessage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
