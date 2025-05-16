//  "use client";
// import { useState, useEffect, useRef } from "react";
// import { Upload } from "lucide-react";
// import BotResponse from "./response";
// import { useUserContext } from "@/context/intData";

// const ChatMessages = () => {
//   const [messages, setMessages] = useState<{ role: string; content: string; msg_function:string }[]>([]);
//   const [input, setInputText] = useState("");
//   const [zone, setZone] = useState("");
//   const prevThreadId = useRef<string | null>(null); 
//   const { selectedThreadId, setSelectedThreadId } = useUserContext(); 

//   // const [histroyRequiresRefresh, setHistoryRequiresRefresh] = useState(false);

//   interface SaveMessageParams {
//     threadID: string | null;
//     role: string;
//     content: string;
//     msg_function: string;
//   }

//   async function saveMessageFunc({
//     threadID,
//     role,
//     content,
//     msg_function,
//   }: SaveMessageParams){
//     try {
//       const res = await fetch(`/api/chat/${threadID}/savemessage`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           role,
//           content,
//           msg_function,
//         }),
//       });

//       const data = await res.json();
//       console.log(data);
     
//       const newMessage = { role, content, msg_function }; 
//       setMessages((prev) => [...prev, newMessage]);

//     }catch (error) {
//       console.error("Error saving message:", error);
    
//   }
// }   


//   useEffect(() => {
//     const initializeChat = async () => {
//       if (selectedThreadId && prevThreadId.current !== selectedThreadId) {
//         prevThreadId.current = selectedThreadId; 
       
//         try {
          
//           // const previousMessages = await getAllMessages(selectedThreadId);
//           const res = await fetch(`/api/chat/${selectedThreadId}/messages`, {
//             method: 'GET',
//           });
                
//           const previousMessages = await res.json();

//           console.log("Fetched messages:", previousMessages);
//           if (Array.isArray(previousMessages)) {
//             setMessages(previousMessages.map(({ role, content, msg_function }) => ({ role, content, msg_function })));
//           } else {
//             setMessages([]);
//           }
//         } catch (error) {
//           console.error("Error fetching messages:", error);
//         }
//       } else {
//         setMessages([]); 
//       }
//     };

//     initializeChat();
//   }, [selectedThreadId]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputText(e.target.value);
//   };

//   const extractVehicleData = (response_data: (string | number)[]) => {
//     let vehicleCount: number | 0 = 0;
//     let botReply: string | "" = "";
  
//     response_data.forEach((item) => {
//       if (typeof item === "number") {
//         vehicleCount = item;
//       } else if (typeof item === "string") {
//         botReply = item;
//       }
//     });
  
//     return { vehicleCount, botReply };
//   };
  
//   const sendVehicleDescription = async (message: string, length: number | null, breadth: number | null, height: number | null, wt_capacity: number | null, quantity: string | null, name: string | null, currentTruckID: string ) => {
//     const data = {
//       Inside_Dimensions_Length: length,
//       Inside_Dimensions_Width: breadth,
//       Inside_Dimensions_Height: height,
//       Max_Cargo_Weight: wt_capacity,
//       Model_Name: name,
//       Vehicle_Quantity: quantity
//     };
  
//     const description_apiUrl = `https://chief-formerly-civet.ngrok-free.app/vehicle_description_flow?query=${encodeURIComponent(message)}&data=${encodeURIComponent(JSON.stringify(data))}`;
  
   
//     const response = await fetch(description_apiUrl, {
//       method: "POST",
//       headers: { "Accept": "application/json" },
//       body: "" 
//     });
  
//     const response_data = await response.json();

//     const filteredData = Object.fromEntries(
//       Object.entries(response_data.data).filter(([_, value]) => value !== null)
//     );
    
//     try {
//       const res = await fetch(`/api/truck/${currentTruckID}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(filteredData),
//       });
//       const wasUpdated = await res.json();
//       console.log("was my truck updated;", wasUpdated);

//     }catch(error){
//       console.log("Unable to update");
//     }

//     // const wasUpdated = await updateTruck(currentTruckID, filteredData);

//     return response_data.response;

//   };
  

//   const handleZoneBasedAction = async (threadId: string | null, message: string) => {
//     try {
//       let apiUrl = "";

//       const transformData = (data: any) => {
//         return {
//             length: data.length === 0 ? null : data.length,
//             breadth: data.breadth === 0 ? null : data.breadth,
//             height: data.height === 0 ? null : data.height,
//             wt_capacity: data.wt_capacity === 0 ? null : data.wt_capacity,
//             quantity: data.quantity === 0 ? null : data.quantity,
//             name: null
//         };
//     };



//       const eachVehicleDesc = async (truckID: string) => {

//         try {
//           const res = await fetch(`/api/truck/${truckID}`, {
//             method: 'GET',
            
//           });
//           const currentTruck = await res.json();
//           console.log("was my truck updated;", currentTruck);

//           const transformed_data = transformData(currentTruck);
//               const api_response = await sendVehicleDescription(message,transformed_data.length, transformed_data.breadth, transformed_data.height, transformed_data.wt_capacity, transformed_data.quantity, transformed_data.name, truckIds[i] )
              

//               const botMessageContent = typeof api_response === "string" 
//               ? api_response 
//               : JSON.stringify(api_response);

//           const botMessage = { 
//               role: "assistant", 
//               content: botMessageContent, 
//               msg_function: "bot_reply" 
//           };

//             await saveMessageFunc({threadID: threadId,  role:botMessage.role, content:botMessage.content,msg_function: botMessage.msg_function});

//             // await saveMessage(threadId, botMessage.role, botMessage.content, botMessage.msg_function);
        

//             return null;
    
//         }catch(error){
//           console.log("Unable to update");
//         }

//         // const currentTruck = await getTruck(truckID);
//               // const isSat = await isSatisfied(truckID);
//               // console.log("Is satisfied:", isSat);
              
//       }


//       const handleCargoCallandAction = async () => {
//         const description_apiUrl = `https://chief-formerly-civet.ngrok-free.app/cargo_description_flow?query=${encodeURIComponent(message)}`;
  
   
//         const response = await fetch(description_apiUrl, {
//           method: "POST",
//           headers: { "Accept": "application/json" },
//           body: "" 
//         });
  
//         const api_response = await response.json();

//         console.log("api responses::", api_response)

//         const formattedCargo = {
//           quantity: api_response.Cargo_Quantity,
//           length: api_response.Cargo_Length,
//           breadth: api_response.Cargo_Width,
//           height: api_response.Cargo_Height,
//           weight: api_response.Cargo_Weight,
//         };


//         try {
//           const res = await fetch(`/api/userdata/cargo`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               threadId: selectedThreadId,
//               cargoData: formattedCargo
//             }),
//           });
//           const objCreated = await res.json();
//           console.log("object Created:", objCreated);
          
    
//         }catch(error){
//           console.log(error, "Unable to update");
//         }
    
        


//         // const objCreated = await createCargoObjects(selectedThreadId!,formattedCargo);

//           const botMessage = { 
//               role: "assistant", 
//               content: "Okay got that! Please describe other kinds of cargo boxes you may have.", 
//               msg_function: "bot_reply" 
//           };

//           await saveMessageFunc({threadID:threadId, role: botMessage.role, content:botMessage.content,msg_function: botMessage.msg_function});

//             // await saveMessage(threadId, botMessage.role, botMessage.content, botMessage.msg_function);

//             return null;
//       }

//       let truckStack: string[] = [];
  
//       switch (zone) {
//         case "vehicle_db":
//           apiUrl = "";
//           break;


//         case "vehicle_custom":
//           const quantity_apiUrl = `https://chief-formerly-civet.ngrok-free.app/vehicle_number?query=${encodeURIComponent(message)}`;
//           const response = await fetch(quantity_apiUrl, {
//             method: "POST",
//             headers: { "Accept": "application/json" },
//             body: JSON.stringify({ message }),
//           });
//           const response_data = await response.json();
//           console.log("in the api response is ", response_data);
//           // const units = Array.isArray(response_data) && response_data.length > 1 ? response_data[0] : null;

          
//           // const reply = Array.isArray(response_data) && response_data.length > 1 ? response_data[2] : null;
//           const { vehicleCount, botReply } = extractVehicleData(response_data);

//           if (vehicleCount && vehicleCount > 0) {

//             // await Promise.all(Array.from({ length: vehicleCount }).map(() => createEmptyTruckObjs(threadId)));
//             await Promise.all(
//               Array.from({ length: vehicleCount }).map(async () => {
//                 try {
//                   const res = await fetch(`/api/userdata/truck`, {
//                     method: 'POST',
//                     headers: {
//                       'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ threadId }), 
//                   });
            
//                   // if (!res.ok) {
//                   //   throw new Error(`Failed to create truck: ${res.status}`);
//                   // }
//                   console.log(`${vehicleCount} empty trucks created.`);
//                   return await res.json(); 
//                 } catch (error) {
//                   console.error(error, 'error');
//                 }
//               })
//             );

//           }

//           const botMessage = { role: "assistant", content: botReply?botReply:"Please try again.", msg_function: "bot_reply" };
//           await saveMessageFunc({threadID: threadId,  role:botMessage.role, content:botMessage.content,msg_function: botMessage.msg_function});

          
//           // await saveMessage(threadId, botMessage.role, botMessage.content, botMessage.msg_function);
//           // setMessages((prev) => [...prev, botMessage]);

//           const botMessage_followUp = { role: "assistant", content: "Can you start by describing one of your vehicles? Please provide its dimensions, weight capacity and the number of units you have of this type.", msg_function: "bot_reply" };

//           await saveMessageFunc({threadID: threadId,  role:botMessage_followUp.role, content:botMessage_followUp.content,msg_function: botMessage_followUp.msg_function});

//           // await saveMessage(threadId, botMessage_followUp.role, botMessage_followUp.content, botMessage_followUp.msg_function);
//           // setMessages((prev) => [...prev, botMessage_followUp]);

          
//           setZone("each_vehicle_description");
//           break;

       

//         case "each_vehicle_description":



//           // const data = await getCompleteData(selectedThreadId);
//           try {
//             const res = await fetch(`/api/userdata/${selectedThreadId}`, {
//               method: 'GET',
//             });
      
//             if (!res.ok) {
//               throw new Error(`Failed to create truck: ${res.status}`);
//             }
            
//             const data =  await res.json(); 
//             const truckIds = data?.trucks?.map(id => String(id)) ?? [];
//             console.log("truckIds are", truckIds);
  
//             truckStack = data?.trucks?.map(id => String(id)) ?? [];       
//             console.log("truckstack is", truckStack);
  
//             const truckID = truckIds[0];
  
//             // const currentTruck = await getTruck(truckID!);
//             const res_truck = await fetch(`/api/truck/${truckID}`, {
//               method: 'GET',
//             });

//             const currentTruck = await res_truck.json();

//             const transformed_data = transformData(currentTruck);
//             const api_response = await sendVehicleDescription(message,transformed_data.length, transformed_data.breadth, transformed_data.height, transformed_data.wt_capacity, transformed_data.quantity, transformed_data.name, truckID! )
            

//             const botMessageContent = typeof api_response === "string" 
//             ? api_response 
//             : JSON.stringify(api_response);

//         const botMessage2 = { 
//             role: "assistant", 
//             content: botMessageContent, 
//             msg_function: "bot_reply" 
//         };
//         await saveMessageFunc({threadID:threadId, role: botMessage2.role, content: botMessage2.content, msg_function: botMessage2.msg_function});


//           // await saveMessage(threadId, botMessage2.role, botMessage2.content, botMessage2.msg_function);
//           // setMessages((prev) => [...prev, botMessage2]);

//             const botMessage_vehicleReply = { role: "assistant", content: "Now please provide details about the first kind of your cargo boxes like their dimensions and quantity.", msg_function: "bot_reply" };
//         // await saveMessage(threadId, botMessage_vehicleReply.role, botMessage_vehicleReply.content, botMessage_vehicleReply.msg_function);
//         // setMessages((prev) => [...prev, botMessage_vehicleReply]);
//         await saveMessageFunc({threadID:threadId, role: botMessage_vehicleReply.role, content: botMessage_vehicleReply.content, msg_function: botMessage_vehicleReply.msg_function});


//           } catch (error) {
//             console.error(error, 'error');
//           }

//               // const isSat = await isSatisfied(truckID!);

           

//               //   console.log("Is satisfied:", isSat);
               
//                 setZone("handle_cargo");
//                 break;

             
            
        
//           case "reset":
//             const botMessage_proc = { role: "assistant", content: "Okay! Processing this information.", msg_function: "bot_reply" };
//             // await saveMessage(threadId, botMessage_proc.role, botMessage_proc.content, botMessage_proc.msg_function);
//             // setMessages((prev) => [...prev, botMessage_proc]);
//             await saveMessageFunc({threadID:threadId, role: botMessage_proc.role, content: botMessage_proc.content, msg_function: botMessage_proc.msg_function});

//             setZone("each_vehicle_description");
//             break;


//           case "handle_cargo":

//           await handleCargoCallandAction();
//           console.log("In cargo");
//           setZone("handle_cargo");
//           break;
        
          

        
        
//         default:
//           console.warn("No API endpoint for this zone");
//           return;
//       }
  
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Accept": "application/json" },
//         body: JSON.stringify({ message }),
//       });
  
//       if (!response.ok) {
//         console.error("API call failed:", response.statusText);
//         return;
//       }
  
       
//     } catch (error) {
//       console.error("Error in API call:", error);
//     }
//   };
  


//   const sendMessage = async () => {

    
//     let threadId = selectedThreadId;
//     let isFirstMessage = messages.length === 0;


//     if (!threadId) {
//       const res = await fetch('/api/chat/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

      
//       if (!res.ok) {
//         throw new Error('Failed to create chat thread');
//       }
      
      
      
//       const data = await res.json();
//       threadId = data.threadID || data._id; // depending on your API response shape
//       const res_user = await fetch('/api/userdata', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ threadId }),       });
//         console.log("threadIddddddddd", threadId);
//         console.log("userd is created", await res_user.json());
        
//         if (!res_user.ok) {
//           throw new Error('Failed to create user Object');
//         }
//       // const newuserdata= await createUserDatas(threadId);
//       // console.log(newuserdata);
//       setSelectedThreadId(threadId);
      
           

//     }; 
//     if (!input.trim()) return;

//     const newMessage = { role: "user", content: input, msg_function:  "user_side"  };
//     console.log("Message sent:", newMessage);



//     try {
//       await saveMessageFunc({threadID:threadId, role:"user", content:input, msg_function:"user_side"});
//       setInputText("");


//       if (isFirstMessage) {
//         await handleFirstMessageAction(threadId, input);
//       } else {
//         await handleZoneBasedAction(threadId, input);
//       }
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   };


//   const handleFirstMessageAction = async (threadId: string | null, message: string) => {
//     try {
     
//       const apiUrl = `https://chief-formerly-civet.ngrok-free.app/vehicle_description_mode?query=${encodeURIComponent(message)}`;
    
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Accept": "application/json"
//       },
//       body: "" // Empty body as per curl request
//     });

//     if (!response.ok) {
//       console.error("API call failed:", response.statusText);
//       return;
//     }

//     const response_data = await response.json();
//     console.log("desc:", response_data);

//     const extractedValue = response_data
    
//     if (extractedValue == "vehicle_database_reference"){  
//       setZone("vehicle_db");
//       const botMessage = { role: "assistant", content: "butResponse", msg_function: "vehicle_mode_selection" };
    
    
//       await saveMessageFunc({threadID: threadId,  role:botMessage.role, content:botMessage.content,msg_function: botMessage.msg_function});
//       setInputText("");

    
//     // await saveMessage(threadId, botMesssage.role,botMesssage.content, botMesssage.msg_function);
//   //        setInputText("");
//     // setMessages((prev) => [...prev, botMesssage]);
//     }

//     else if (extractedValue == "custom_vehicle_description"){
//       setZone("vehicle_custom");
//       console.log("vehiclemode"); 
//     const botMessage = { role: "assistant", content: "Great! Can you start by providing me with the number of vehicles you have?", msg_function: "vehicle_mode_selection"};
//     await saveMessageFunc({threadID: threadId,  role:botMessage.role, content:botMessage.content,msg_function: botMessage.msg_function});
//       setInputText("");

//     // await saveMessage(threadId, botMesssage.role,botMesssage.content, botMesssage.msg_function);
//     // setInputText("");
//     // setMessages((prev) => [...prev, botMesssage]);

//   }
//     else return;

//     }
//     catch (error) {
//       console.error("Error in API call:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="upperpanel w-full right-0 h-[10vh] backdrop-blur-sm px-4 py-2">
//         <h1 className="text-2xl font-extrabold text-white">3D Cargo</h1>
//         <h3 className="text-white">Welcome to the 3D Cargo ChatBOT, visualize now!!</h3>
//         <div> Current thread is {selectedThreadId}</div>
//       </div>

//       <div className="p-4 flex flex-col h-[88vh] relative">
//         <div id="scrollbar" className="flex-1 overflow-y-auto h-full max-h-screen space-y-4 pb-16">
//         <BotResponse botResponse={{ function: "assistant", message: "Hey there! I'm your ChatBOT, here to make exploring 3D Cargo and easy visualization effortless for you!" }} />
// <BotResponse botResponse={{ function: "assistant", message: "Let's begin with vehicle containers! Would you like to pick one from our database or describe your own custom vehicle?" }} />

//           <div>
//             {messages.map((msg, index) =>
//               msg.role === "user" ? (
//                 <div key={index} className="user_msg text-right pr-2 ">
//                   <div className="bg-white text-black p-3 rounded-lg max-w-2xl">{msg.content}</div>
//                 </div>
//               ) :  (
//                 <BotResponse key={index} botResponse={{ function: msg.msg_function , message: msg.content }} />
//               ) 
//             )}
//           </div>
//         </div>

//         <div className="flex items-center bg-black rounded-lg border border-white p-2 mt-4">
//           <label htmlFor="file-upload" className="cursor-pointer text-white mr-2">
//             <Upload className="w-6 h-6 hover:text-gray-300" />
//             <input id="file-upload" type="file" className="hidden" />
//           </label>

//           <input
//             type="text"
//             value={input}
//             onChange={handleInputChange}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             className="w-full rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none"
//             placeholder="Start typing..."
//           />
//           <button className="bg-white text-black py-1 px-4 rounded-lg hover:bg-gray-300" onClick={sendMessage}>
//             Enter
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatMessages;









