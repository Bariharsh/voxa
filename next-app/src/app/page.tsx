"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ApiResponse from "@/types/ApiResponse";
import axios from "axios";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatBox() {
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clearChat = () => {
    setChat([]);
    setInput("");
    window.speechSynthesis.cancel();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const selectedVoice = voices.find((voice) =>
      ["female", "samantha", "zira", "google us"].some((keyword) =>
        voice.name.toLowerCase().includes(keyword)
      )
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    utterance.pitch = 1;
    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const userText = textOverride || input.trim();
      if (!userText || loading) return;

      const userMessage: Message = { sender: "user", text: userText };
      setChat((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      const lowerText = userText.toLowerCase();

      if (lowerText.includes("wake up") || lowerText.includes("hey voxa")) {
        const botReply = "I am awake and ready to assist you!";
        const botMessage: Message = { sender: "bot", text: botReply };
        setChat((prev) => [...prev, botMessage]);
        speak(botReply);
        setLoading(false);
        return;
      }

      if (lowerText.includes("open youtube")) {
        const botReply = "Opening YouTube for you...";
        const botMessage: Message = { sender: "bot", text: botReply };
        setChat((prev) => [...prev, botMessage]);
        speak(botReply);
        window.open("https://www.youtube.com", "_blank");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post<ApiResponse>("/api/send-message", {
          text: userText,
        });

        const botText = res.data.bot.text || "Sorry, I didn't understand that.";
        const botMessage: Message = { sender: "bot", text: botText };
        setChat((prev) => [...prev, botMessage]);
        speak(botText);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMsg = "Error getting response from AI. Try again.";
        setChat((prev) => [...prev, { sender: "bot", text: errorMsg }]);
        speak(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, speak]
  );

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  // Wake-word IPC hook (Picovoice)
  useEffect(() => {
    if (typeof window !== "undefined" && window.voiceAPI) {
      window.voiceAPI.onWakeWord(() => {
        const triggerText = "Hey Voxa";
        setInput(triggerText);
        sendMessage(triggerText);
      });
    }
  }, [sendMessage]);

  const startListening = useCallback(() => {
    window.voiceAPI?.startWakeWord();
  }, []);

  const stopListening = useCallback(() => {
    window.voiceAPI?.stopWakeWord();
  }, []);

  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        startListening();
      }
    };
    window.addEventListener("keydown", handleHotkey);
    return () => window.removeEventListener("keydown", handleHotkey);
  }, [startListening]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
        Voxa AI — Personal Assistant
      </h1>

      <div className="flex-1 overflow-y-auto space-y-4 border border-blue-700/40 rounded-3xl p-6 bg-white/10 backdrop-blur-sm shadow-[0_0_25px_rgba(0,200,255,0.2)]">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`w-full flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`inline-block px-5 py-3 rounded-xl text-sm md:text-base max-w-[80%] whitespace-pre-wrap break-words shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-900 text-white rounded-bl-none"
              }`}
            >
              {msg.text.includes("```") ? (
                <pre className="bg-black/80 text-green-300 p-3 rounded-lg overflow-x-auto text-sm">
                  <code>{msg.text.replace(/```/g, "")}</code>
                </pre>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="w-full flex justify-start">
            <div className="bg-gray-700 px-4 py-2 italic rounded-xl animate-pulse w-fit">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center gap-3">
        <input
          className="flex-1 px-5 py-4 rounded-2xl bg-[#1a1b1f] border border-gray-700 text-white outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-400"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-cyan-600 hover:bg-cyan-700 px-6 py-4 rounded-2xl text-white font-semibold transition disabled:opacity-50 shadow-md"
          onClick={() => sendMessage()}
          disabled={loading}
        >
          Send
        </button>
        <button
          className={`${
            isSpeaking ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
          } px-6 py-4 rounded-2xl text-white font-semibold transition shadow-md`}
          onClick={startListening}
        >
          Start Wake Word
        </button>
        <button
          className="bg-orange-600 hover:bg-orange-700 px-6 py-4 rounded-2xl text-white font-semibold transition shadow-md"
          onClick={stopListening}
        >
          Stop Wake Word
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 px-6 py-4 rounded-2xl text-white font-semibold transition shadow-md"
          onClick={clearChat}
        >
          Clear Chat
        </button>
      </div>

      <p className="text-center text-sm mt-4 text-gray-400">
        Press <span className="text-cyan-300 font-semibold">Ctrl + Shift + A</span> to activate wake-word
      </p>
    </div>
  );
}
