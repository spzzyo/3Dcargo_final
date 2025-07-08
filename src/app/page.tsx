"use client";
import { useState } from "react";
// import { UserProvider } from "@/context/intData";
import DataInterpreted from "./components/dataInterpreted";
import LightChatMessages from "./components/lightChatMessage";
// import ChatMessages from "./components/chatMsg";
import ChatHistory from "./components/chatHistory";



export default function Home() {

  

  return (
    // <UserProvider>

    <div className="grid grid-cols-[20%_50%_30%] h-screen bg-black">
    <div className="p-4 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 ">
    <ChatHistory />
    </div>
    
    <div className="grid grid-rows-[10%_90%] border border-gray-600 h-screen rounded-sm">
    <LightChatMessages  />
    
  </div>
  
  
    <div className="p-4 grid grid-rows-[85%_15%]  bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800">
      
    <DataInterpreted/>
    </div>
  </div>
  // </UserProvider>
  );
}