import { format } from "date-fns";

interface MessageProps {
  message: {
    text: string;
    timestamp: Date;
  };
  isCurrentUser: boolean;
}

export default function Message({ message, isCurrentUser }: MessageProps) {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <p>{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            isCurrentUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {format(message.timestamp, "h:mm a")}
        </p>
      </div>
    </div>
  );
}
