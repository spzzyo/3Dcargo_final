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
    config: TruckConfig,
    arrangement: BoxPosn[];
  };
}

const TruckViewer: FC<TruckViewerProps> = ({ truckData }) => {

  useEffect(() => {
    const postTruckData = async () => {
      try {
        const response = await fetch("http://10.119.11.41:8000/eachPartitionedData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(truckData),
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
    <div className="w-full h-full">
      <iframe
        src="untiycheckkk/index.html"
        className="w-full h-full border-none rounded-2xl"
        title={`Unity for ${truckData.truckId}`}
      />
    </div>
  );
};

export default TruckViewer;
