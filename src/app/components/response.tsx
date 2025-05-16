// "use client";

// import { getAllTrucks } from "@/actions/truck";

// interface BotResponseProps {
//   botResponse: {
//     function: string;
//     message: string;
//   };

// }



// const BotResponse = ({ botResponse }: BotResponseProps) => {
//   return (
   
    
  
//         <div className="bot_msg m-3">
//           <div className="text-white border border-gray-600 p-3 rounded-lg max-w-xl">
//             {botResponse.message}
//           </div>
//         </div>
  

  
//   );
// };

// export default BotResponse;


"use client";


interface BotResponseProps {
  botResponse: {
    function: string;
    message: string;
  };
}

const BotResponse = ({ botResponse }: BotResponseProps) => {



  return (
    <div className="bot_msg m-3">
      <div className="text-white border border-gray-600 p-3 rounded-lg max-w-xl">
        {botResponse.function === "vehicle_mode_selection" ? (
          // <ul>
          //   {trucks.length > 0 ? (
          //     trucks.map((truck, index) => (
          //       <li key={index} className="p-2 border-b border-gray-500">
          //         <strong>{truck.name}</strong> - {truck.length}m x {truck.breadth}m x {truck.height}m - {truck.wt_capacity}kg capacity
          //       </li>
          //     ))
          //   ) : (
          //     <p>Loading available trucks...</p>
          //   )}
          // </ul>
          botResponse.message
        ) : (
          botResponse.message
        )}
      </div>
    </div>
  );
};

export default BotResponse;
