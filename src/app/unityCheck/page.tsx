"use client";

import Head from 'next/head';
import { FC, useState, useEffect} from 'react';
import TruckViewer from './unityBuild';


const PlayUnity: FC = () => {
  const [trucksList, setTrucksList] = useState<any[]>([]);
  const [selectedTruckIndex, setSelectedTruckIndex] = useState<number>(0);

  
  

  useEffect(() => {
    const fetchData = async () => {
      const numberOfTrucks = Number(sessionStorage.getItem("numberOfTrucks"));

      try {
        const response = await fetch("http://10.119.11.41:8000/completeOutputData", {
          method: "GET",
        });

        const dataOutput = await response.json();

        console.log("Fetched output data:", dataOutput);

   

        const trucksList = [];
        console.log("num of trucks", numberOfTrucks);

        for (let i = 1; i <= numberOfTrucks; i++) {
          const truckKey = `truck${i}`;
          if (dataOutput[truckKey]) {
            const truckBody = {
              truckId: truckKey,
              config: dataOutput[truckKey].truck_config,
              arrangement: dataOutput[truckKey].arrangement.final_arrangement
            };
            trucksList.push(truckBody);
          }
        }

        setTrucksList(trucksList);

        console.log("Total trucks stored:", trucksList.length);
        trucksList.forEach((truck, index) => {
          console.log(`Truck ${index + 1} (${truck.truckId}):`);
          console.log("Config:", truck.config);
          console.log("Arrangement length:", truck.arrangement.length);
          console.log("First box (if any):", truck.arrangement[0] || "No boxes placed");
          console.log("------------------------------");
        });

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
     fetchData();
  }, []);







  
return (
  <>
  <Head>
        <title>Truck Visualization</title>
      </Head>
      <div className="bg-black min-h-screen flex flex-col items-center justify-start p-4">
        <div className="flex space-x-4 mb-4">
          {trucksList.map((truck, index) => (
            <button
              key={truck.truckId}
              className={`px-4 py-2 rounded-md text-white ${
                selectedTruckIndex === index ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setSelectedTruckIndex(index)}
            >
              {truck.truckId}
            </button>
          ))}
        </div>

        <div className="w-full h-[80vh] bg-gray-950 rounded-2xl overflow-hidden shadow-2xl p-2">
          {trucksList.length > 0 && (
            <TruckViewer truckData={trucksList[selectedTruckIndex]} />
          )}
        </div>
      </div>
   

  <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #6b7280;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #9ca3af;
    }
  `}</style>
</>
);


};

export default PlayUnity;
