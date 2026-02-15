"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createFeedback } from "@/lib/actions/general.action";
import {
  speak,
  startListening,
  stopListening,
  stopSpeaking,
} from "@/lib/voiceagent";

enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "assistant";
  content: string;
}

const Agent = ({ userName, userId, interviewId, feedbackId }: AgentProps) => {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);

  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ Start Interview
  const handleCall = async () => {
    console.log("Start Interview clicked");

    setMessages([]);
    setCallStatus(CallStatus.ACTIVE);

    askGeminiQuestion([]);
  };

  const askGeminiQuestion = async (conversation: SavedMessage[]) => {
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversation,
        }),
      });

      const data = await res.json();

      const question = data.question;

      if (!question || question === "END_INTERVIEW") {
        endInterview();
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: question },
      ]);

      speak(
        question,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);

          startListening((answer) => {
            const updated = [
              ...conversation,
              { role: "assistant", content: question },
              { role: "user", content: answer },
            ];

            setMessages(updated);

            askGeminiQuestion(updated);
          });
        }
      );
    } catch (error) {
      console.error(error);
      endInterview();
    }
  };

  const endInterview = async () => {
    stopListening();
    stopSpeaking();

    setCallStatus(CallStatus.FINISHED);

    if (!interviewId || !userId) {
      router.push("/");
      return;
    }

    try {
      await createFeedback({
        interviewId,
        userId,
        transcript: messages,
        feedbackId,
      });

      router.push(`/interview/${interviewId}/feedback`);
    } catch (error) {
      console.error(error);
      router.push("/");
    }
  };

  const handleDisconnect = () => {
    endInterview();
  };

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
            />

            {isSpeaking && <span className="animate-speak" />}
          </div>

          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={120}
              height={120}
              className="rounded-full"
            />

            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mt-6">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="btn-call" onClick={handleCall}>
            Start Interview
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End Interview
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
