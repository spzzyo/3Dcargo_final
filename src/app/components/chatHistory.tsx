"use client";
import { useState, useEffect } from "react";
// import { getAllThreads } from "../../../../actions/messages";
import { useUserContext } from "@/context/intData";

const ChatHistory = ( ) => {
  const { setSelectedThreadId } = useUserContext();
  const [threads, setThreads] = useState<string[]>([]);


  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetch(`/api/chat/all`, {
          method: 'GET',
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setThreads(data.map((thread) => thread?.id || ""));

        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };
  
    fetchThreads();
  }, []);
  
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">Chat History</h2>
      <ul className="space-y-2">
        {threads.map((threadId, index) => (
          <li
            key={threadId}
            className="p-2 bg-gray-800 text-white cursor-pointer hover:bg-gray-700 rounded-lg"
            onClick={() =>{ 
              console.log("Thread clicked:", threadId);
              setSelectedThreadId(threadId);}}
          >
             {`Chat Thread-${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
