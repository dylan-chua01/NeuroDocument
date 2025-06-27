import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import React from "react";

type Props = {
  messages: Array<
    Message & { sources?: Array<{ page: number; content: string }> }
  >;
};

const MessageList = ({ messages }: Props) => {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex", {
            "justify-end pl-10": message.role === "user",
            "justify-start pr-10": message.role === "assistant",
          })}
        >
          <div
            className={cn(
              "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
              {
                "bg-blue-600 text-white": message.role === "user",
                "bg-gray-50": message.role === "assistant",
              }
            )}
          >
            <p
              className={cn({
                "text-white": message.role === "user",
                "text-gray-900": message.role === "assistant",
              })}
            >
              {message.content}
            </p>
            {message.sources && (
              <div className="mt-1 text-xs text-gray-500">
                Sources:{" "}
                {message.sources.map((s) => `Page ${s.page}`).join(", ")}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
