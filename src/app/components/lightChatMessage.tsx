"use client";
import { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import BotResponse from "./response";
import { useUserContext } from "@/context/intData";

const LightChatMessages = () => {
  const [messages, setMessages] = useState<{ role: string; content: string; msg_function:string }[]>([]);
  const [input, setInputText] = useState("");
  const prevThreadId = useRef<string | null>(null); 
  const { selectedThreadId, setSelectedThreadId } = useUserContext(); 
  const [currentZone, setCurrentZone] = useState("zone_introduction");
  const [lastBotResponse, setLastBotResponse] = useState<string | null>(null);
  const [isZoneInitiator, setIsZoneInitiator] = useState(true);
  const [vehicleCount, setVehicleCount] = useState<number | null>(null);
  const { setLastRefresh } = useUserContext();

  // const [histroyRequiresRefresh, setHistoryRequiresRefresh] = useState(false);

  interface SaveMessageParams {
    threadID: string | null;
    role: string;
    content: string;
    msg_function: string;
  }

  async function saveMessageFunc({
    threadID,
    role,
    content,
    msg_function,
  }: SaveMessageParams){
    try {
      const res = await fetch(`/api/chat/${threadID}/savemessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          content,
          msg_function,
        }),
      });

      const data = await res.json();
      console.log(data);
     
      const newMessage = { role, content, msg_function }; 
      setMessages((prev) => [...prev, newMessage]);

    }catch (error) {
      console.error("Error saving message:", error);
    
  }
}   



interface Response{
  replyBot : string, 
  nextZone : string,
  zone_retained : boolean,
  extraData?: { [key: string]: unknown }

}

async function getBotReply(inputMessage: string, threadId: string, currentZone : string, lastBotResponse : string ,isZoneInitiator : boolean , extraData?: { [key: string]: unknown }){

  try {
    const payload = {
      inputMessage,
      threadId,
      extraData,
      currentZone,
      lastBotResponse,
      isZoneInitiator,
    };
    
    console.log('Calling API: /api/start');
    console.log('Request Payload:', payload);
    
    const res = await fetch('/api/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const raw_data = await res.json();
    const data: Response = raw_data;
    console.log(data);
    const lastBotResponse_client : string = data.replyBot;
    const isZoneInitiator_client : boolean = !data.zone_retained;
    const currentZone_client : string = data.nextZone; 
    const extraData_client  = data.extraData? data.extraData : {}; 

    console.log("data from start api is", data)

    await saveMessageFunc({threadID:threadId, role:"assistant", content:lastBotResponse_client, msg_function:"bot_reply"});
    return {lastBotResponse_client, isZoneInitiator_client, currentZone_client, extraData_client};


  }catch (error) {
    console.error("Error saving message:", error);
    return {};
  
}



} 

  useEffect(() => {
    const initializeChat = async () => {
      if (selectedThreadId && prevThreadId.current !== selectedThreadId) {
        prevThreadId.current = selectedThreadId; 
       
        try {
          
          // const previousMessages = await getAllMessages(selectedThreadId);
          const res = await fetch(`/api/chat/${selectedThreadId}/messages`, {
            method: 'GET',
          });
                
          const previousMessages = await res.json();

          console.log("Fetched messages:", previousMessages);
          if (Array.isArray(previousMessages)) {
            setMessages(previousMessages.map(({ role, content, msg_function }) => ({ role, content, msg_function })));
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      } else {
        setMessages([]); 
      }
    };

    initializeChat();
  }, [selectedThreadId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };





  const sendMessage = async () => {    
    let threadId = selectedThreadId;
    if (!threadId) {
      const res = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to create chat thread');
      }
           
      
      const data = await res.json();
      threadId = data.threadID || data._id; 
      const res_user = await fetch('/api/userdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId }),       });
        
        if (!res_user.ok) {
          throw new Error('Failed to create user Object');
        }
     
      setSelectedThreadId(threadId);
      
           

    }; 
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input, msg_function:  "user_side"  };
    console.log("Message sent:", newMessage);



    try {
      await saveMessageFunc({threadID:threadId, role:"user", content:input, msg_function:"user_side"});
      setInputText("");

      // if (vehicleCount){
      //   const  {lastBotResponse_client, isZoneInitiator_client, currentZone_client, extraData_client} = await getBotReply( input, selectedThreadId? selectedThreadId:"", currentZone, lastBotResponse ,isZoneInitiator, {"vehicleCount": vehicleCount});  

      // setLastBotResponse(lastBotResponse_client);
      // setIsZoneInitiator(isZoneInitiator_client);
      // setCurrentZone(currentZone_client);
      
      // const maybeCount = Number(extraData_client?.vehicleCount);
      //   if (!isNaN(maybeCount)) {
      //     setVehicleCount(maybeCount);
      //   }
      // }
      // else {
      // const  {lastBotResponse_client, isZoneInitiator_client, currentZone_client, extraData_client} = await getBotReply( input, selectedThreadId? selectedThreadId:"", currentZone, lastBotResponse ,isZoneInitiator, {});
      // setLastBotResponse(lastBotResponse_client);
      // setIsZoneInitiator(isZoneInitiator_client);
      // setCurrentZone(currentZone_client);
      
      // const maybeCount = Number(extraData_client?.vehicleCount);
      //   if (!isNaN(maybeCount)) {
      //     setVehicleCount(maybeCount);
      //   }
      // }

          const extraData = vehicleCount ? { "vehicleCount":vehicleCount } : {};
          const {
            lastBotResponse_client,
            isZoneInitiator_client,
            currentZone_client,
            extraData_client
          } = await getBotReply(
            input,
            selectedThreadId ?? "",
            currentZone,
            lastBotResponse?? "",
            isZoneInitiator,
            extraData
          );

          

          // setLastBotResponse(lastBotResponse_client);
          if (lastBotResponse_client !== undefined) {
          setLastBotResponse(lastBotResponse_client);
          }

          if (isZoneInitiator_client !== undefined){
          setIsZoneInitiator(isZoneInitiator_client);
          }

           if (currentZone_client !== undefined){
          setCurrentZone(currentZone_client);
           }

          const maybeCount = Number(extraData_client?.vehicleCount);
          if (!isNaN(maybeCount)) {
            setVehicleCount(maybeCount);
          }

          const maybeTrucks = extraData_client?.TRUCKS ; 
          if (maybeTrucks == true){
            console.log("OHHEY TRUCKS TRUE")
          } 
          else{
             console.log("OHHEY TRUCKS FALSE")
          }
      
          


          

      console.log("the current state of each value is : ");
      console.log("currentZone:", currentZone);
      console.log("lastBotResponse:", lastBotResponse);
      console.log("isZoneInitiator:", isZoneInitiator);
      console.log("vehicleCount:", vehicleCount);

      setLastRefresh(Date.now());

     
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };



  return (
    <div>
      <div className="upperpanel w-full right-0 h-[10vh] backdrop-blur-sm px-4 py-2">
        <h1 className="text-2xl font-extrabold text-white">3D Cargo</h1>
        <h3 className="text-white">Welcome to the 3D Cargo ChatBOT, visualize now!!</h3>
        <div> Current thread is {selectedThreadId}</div>
      </div>

      <div className="p-4 flex flex-col h-[88vh] relative">
        <div id="scrollbar" className="flex-1 overflow-y-auto h-full max-h-screen space-y-4 pb-16">
        <BotResponse botResponse={{ function: "assistant", message: "Hey there! send Hi to start" }} />

          <div>
            {messages.map((msg, index) =>
              msg.role === "user" ? (
                <div key={index} className="user_msg text-right pr-2 ">
                  <div className="bg-white text-black p-3 rounded-lg max-w-2xl">{msg.content}</div>
                </div>
              ) :  (
                <BotResponse key={index} botResponse={{ function: msg.msg_function , message: msg.content }} />
              ) 
            )}
          </div>
        </div>

        <div className="flex items-center bg-black rounded-lg border border-white p-2 mt-4">
          <label htmlFor="file-upload" className="cursor-pointer text-white mr-2">
            <Upload className="w-6 h-6 hover:text-gray-300" />
            <input id="file-upload" type="file" className="hidden" />
          </label>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="w-full rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none"
            placeholder="Start typing..."
          />
          <button className="bg-white text-black py-1 px-4 rounded-lg hover:bg-gray-300" onClick={sendMessage}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LightChatMessages;
