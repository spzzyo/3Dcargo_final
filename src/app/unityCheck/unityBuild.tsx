"use client";

import { FC, useEffect } from "react";

interface TruckConfig {
  length: number;
  width: number;
  height: number;
  wt_capacity: number;
}

interface BoxPosn {
  box_id: string;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  length: number;
  width: number;
  height: number;
  x_norm: number;
  y_norm: number;
  z_norm: number;
  group: number;
  placed: boolean;
}

interface TruckViewerProps {
  truckData: {
    truckId: string;
    config: TruckConfig;
    arrangement: BoxPosn[];
  };
}

const TruckViewer: FC<TruckViewerProps> = ({ truckData }) => {
  useEffect(() => {
    const postTruckData = async () => {
      const postData = {
        truck_config: truckData.config,
        final_arrangement: truckData.arrangement,
      };
      try {
        console.log(
          `Sending POST data for ${truckData.truckId}:`,
          JSON.stringify(postData, null, 2)
        );
        const response = await fetch("http://10.119.11.41:8081/eachPartitionedData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        const data = await response.json();
        console.log(`API response for ${truckData.truckId}:`, data);
      } catch (error) {
        console.error(`Failed to post data for ${truckData.truckId}:`, error);
      }
    };

    postTruckData();
  }, [truckData]);

  return (
    <div className="flex w-full h-full">
      {/* Left Panel */}
      <div className="w-1/4 bg-black text-white p-4 overflow-auto rounded-l-2xl">
        <h2 className="text-xl font-bold mb-4">Cargo Overview</h2>
        <p className="mb-2">Total Boxes: {truckData.arrangement.length}</p>
        <div className="space-y-2">
          {truckData.arrangement.map((box, idx) => (
            <div key={box.box_id} className="border-b border-gray-700 pb-2">
              <p className="font-semibold">Box {idx + 1}: {box.box_id}</p>
              <p className="text-sm">Position: ({box.pos_x}, {box.pos_y}, {box.pos_z})</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel (Unity iframe) */}
      <div className="w-3/4 h-full">
        <iframe
          src="unityvthree/index.html"
          className="w-full h-full border-none rounded-r-2xl"
          title={`Unity for ${truckData.truckId}`}
        />
      </div>
    </div>
  );
};

export default TruckViewer;
