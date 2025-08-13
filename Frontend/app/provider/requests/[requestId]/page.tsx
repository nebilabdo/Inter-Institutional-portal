"use client";

import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendHorizonal } from "lucide-react";

const consumerName = "EduApp"; // You missed this in your code!

export default function ProviderChatPage() {
  const { requestId } = useParams();

  const requestDetails = {
    provider: "HealthDept",
    api: `API for Request ${requestId}`,
    purpose: `Purpose for Request ${requestId}`,
    date: "2024-07-14",
    consumer: consumerName,
  };

  const initialMessages = [
    {
      sender: "consumer",
      text: `Hello, I need access for request ${requestId}`,
      time: "09:00 AM",
    },
    {
      sender: "provider",
      text: "Hi, can you specify the fields needed?",
      time: "09:02 AM",
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      sender: "provider",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Info */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-700">
              API Access Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Consumer</p>
              <p className="text-lg font-semibold text-gray-800">
                {requestDetails.consumer}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Requested API</p>
              <p className="text-base font-medium text-gray-700">
                {requestDetails.api}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Purpose</p>
              <p className="text-base text-gray-600">
                {requestDetails.purpose}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Request Date</p>
              <p className="text-base text-gray-600">{requestDetails.date}</p>
            </div>
            <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              Approve Request
            </Button>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="shadow-lg flex flex-col h-[500px]">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-700">
              Conversation with {consumerName}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-end ${
                    msg.sender === "provider" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "consumer" && (
                    <Avatar className="mr-2 h-7 w-7">
                      <AvatarFallback className="text-xs">E</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm text-sm ${
                      msg.sender === "provider"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                    <div className="text-[10px] mt-1 text-right opacity-80">
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="mt-auto flex items-center gap-2 border-t pt-2"
            >
              <Input
                placeholder="Write your message..."
                className="flex-1 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
              >
                <SendHorizonal className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
