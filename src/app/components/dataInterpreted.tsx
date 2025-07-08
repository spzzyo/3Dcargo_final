"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/intData";
import { useRouter } from "next/navigation";

// import { getCompleteData } from "../../../../actions/userdata";
// import { getTruck } from "../../../../actions/myTruck";
// import { getCargo } from "../../../../actions/cargo";

import { IUserData } from "@/types/c_userData";
import { IMyTruck } from "@/types/c_truck";
import { IMyCargo } from "@/types/c_cargo";
import ObjViewer from "./objViewer";

import Image from "next/image";

const DataInterpreted = () => {
  const { selectedThreadId } = useUserContext();
  const [intData, setIntData] = useState<IUserData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [truckDetails, setTruckDetails] =  useState<{ [key: string]: IMyTruck | null }>({});
  const [cargoDetails, setCargoDetails] = useState<{ [key: string]: IMyCargo | null }>({});
  // const [isDisabled, setDisable] = useState(false);
  const { lastRefresh } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedThreadId) {
        setIntData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {

        // const data = await getCompleteData(selectedThreadId);
        const res = await fetch(`/api/userdata/${selectedThreadId}`, {
          method: 'GET',
        });
            
      const data : IUserData = await res.json() ;

        setIntData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIntData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedThreadId, lastRefresh]);

  useEffect(() => {
    const fetchTruckDetails = async () => {
      if (intData){
      if (intData.trucks?.length > 0) {
        const details: { [key: string]: IMyTruck | null } = {};
        for (const truckId of intData.trucks.map(id => String(id))) {
          try {
            // details[truckId] = await getTruck(truckId);
            const res = await fetch(`/api/truck/${truckId}`, {
              method: 'GET',
            });

            details[truckId] = await res.json() as IMyTruck;



          } catch (error) {
            console.error(`Error fetching details for truck ${truckId}:`, error);
            details[truckId] = null;
          }
        }
        setTruckDetails(details);
      }
    }
    };

    const fetchCargoDetails = async () => {
      if (intData){
      if (intData?.cargoBoxes?.length > 0) {
        const details : {[key: string] :  IMyCargo | null} = {};
        for (const cargoId of intData.cargoBoxes.map(id => String(id))) {
          try {
            // details[cargoId] = await getCargo(cargoId);
            const res = await fetch(`/api/cargo/${cargoId}`, {
              method: 'GET',
            });

            details[cargoId] = await res.json() as IMyCargo;
            
          } catch (error) {
            console.error(`Error fetching details for cargo ${cargoId}:`, error);
            details[cargoId] = null;
          }
        }
        setCargoDetails(details);
      }
    }
    };
    
    if (intData) {
      fetchTruckDetails();
      fetchCargoDetails();
    }
  }, [intData]);
  
  // async function temporaryHandleClick() {



  //   sessionStorage.setItem("truckData", JSON.stringify(truckDetails));
  //   sessionStorage.setItem("cargoData", JSON.stringify(cargoDetails));



  //   router.push('/unityCheck');
  // }

  async function handleClick() {
    setLoading2(true);

    if (!intData?.trucks?.length) {
      console.error("No trucks available in intData");
      return;
    }
  
    const firstTruckId = String(intData.trucks[0]);  
    const truck : IMyTruck | null = truckDetails[firstTruckId];

    const truckTypes: Record<string, number[]> = {};
    intData.trucks.forEach((truckId: string) => {
      const truck : IMyTruck | null = truckDetails[truckId];

      if (truck) {
        
        
  
        truckTypes[truck.name] = [
          Math.round(truck.length * 39.3701), // Convert meters to inches, round to integer
          Math.round(truck.breadth * 39.3701),
          Math.round(truck.height * 39.3701),
          Math.round(truck.wt_capacity * 1000), // Convert kg to grams, round to integer
          truck.quantity,
        ];
      } else {
        console.warn(`Truck details not found for TruckId: ${truckId}`);
      }
    });




 
    const cargoBoxTypes: Record<string, number[]> = {};
  
    intData.cargoBoxes.forEach((cargoId: string, index: number) => {
      const cargo : IMyCargo | null = cargoDetails[cargoId];
  
      if (cargo) {
        
        const boxKey = ["XS", "S", "M"][index] || `BoxType-${index + 1}`;
  
        cargoBoxTypes[boxKey] = [
          Math.round(cargo.length * 39.3701), // Convert meters to inches, round to integer
          Math.round(cargo.breadth * 39.3701),
          Math.round(cargo.height * 39.3701),
          Math.round(cargo.weight * 1000), // Convert kg to grams, round to integer
          cargo.quantity,
        ];
      } else {
        console.warn(`Cargo details not found for cargoId: ${cargoId}`);
      }
    });
  
    const requestBody = {
      TRUCK_TYPES : truckTypes,
      BOX_TYPES: cargoBoxTypes,
      
    };
  
    console.log("Request Body:", JSON.stringify(requestBody));
    
  
    try {
      const response = await fetch("http://10.119.11.41:8081/cargoDistribution", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);

      }
  
      const result = await response.json();
      const truckKeys = Object.keys(result).filter(key => key.startsWith("truck"));
      const numberOfTrucks = truckKeys.length;
      sessionStorage.setItem("numberOfTrucks", JSON.stringify(numberOfTrucks));
      console.log("NUMBEROFTRUCKS@DATAINterpreted:", numberOfTrucks);

      console.log("Response:", result);

      



    sessionStorage.setItem("truckData", JSON.stringify(truckDetails));
    sessionStorage.setItem("cargoData", JSON.stringify(cargoDetails));



    router.push('/unityCheck');

    } catch (error) {
      console.error("Fetch error:", error);
    }
    finally {
      setLoading2(false);
    }
  }
  




  if (!selectedThreadId) return null;

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (!intData) {
    return <div className="text-center text-gray-400">No data available</div>;
  }

  return (
    <div className="bg-gray-700 box relative">
      {/* Overlay while loading */}
      {loading2 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-white h-16 w-16 animate-spin"></div>
        </div>
      )}
  
      <div className={`p-4 ${loading2 ? "pointer-events-none opacity-50" : ""}`}>
        <h2 className="text-xl font-bold text-white mb-4 text-center">Data Interpreted</h2>
      </div>
  
      <div className="bg-black h-5/6 mx-2 rounded-xl">
        <div className="p-4 text-white">
          {/* Trucks Section */}
          <div>
            <h2 className="text-l font-semibold mb-3 text-gray-300">Trucks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intData.trucks.length > 0 ? (
                intData.trucks.map((truckId, index) => {
                  const truck = truckDetails[truckId];
                  return truck ? (
              

                    <div
                    key={index}
                    className="relative group " // gives vertical space for hover content above
                  >
                    {/* Hover card placed ABOVE the main card */}
                    <div className="absolute bottom-full mb-2 left-0 w-full flex justify-center z-20 hidden group-hover:flex">
                      <div className="w-full bg-gray-300 rounded-lg p-2 shadow-2xl">
                        <ObjViewer url={`/model_objs/truck${index+1}.obj`} />
                      </div>
                    </div>

                    {/* Main truck card */}
                    <div className="bg-gray-800 text-gray-200 px-6 py-3 rounded-lg shadow-lg transition-all group-hover:shadow-blue-500/50">
                      <h3 className="font-bold text-sm">{`Vehicle-${truck.name}`}</h3>
                      <p className="text-xs">
                        LBH: {truck.length}m x {truck.breadth}m x {truck.height}m
                      </p>
                      <p className="text-xs">
                        Quantity: {truck.quantity} | Capacity: {truck.wt_capacity}kg
                      </p>
                    </div>
                  </div>


                  ) : (
                    <p key={index} className="text-gray-500">{truckId}</p>
                  );
                })
              ) : (
                <p className="text-gray-500">No trucks available</p>
              )}
            </div>
          </div>
  
          {/* Cargo Section */}
          <div>
            <h2 className="text-l font-semibold mb-3 text-gray-300">Cargo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intData.cargoBoxes.length > 0 ? (
                intData.cargoBoxes.map((cargoId, index) => {
                  const cargo = cargoDetails[cargoId];
                  return cargo ? (
                    // <div
                    //   key={index}
                    //   className="bg-gray-800 text-gray-200 px-6 py-3 rounded-lg shadow-lg transition-all hover:shadow-green-500/50"
                    // >
                    //   <h3 className="font-bold text-sm">{`Cargo type-${index + 1}`}</h3>
                    //   <p className="text-xs">Quantity: {cargo.quantity}</p>
                    //   <p className="text-xs">
                    //     LBH: {cargo.length}m x {cargo.breadth}m x {cargo.height}m
                    //   </p>
                    //   <p className="text-xs">Weight: {cargo.weight}kg</p>
                    // </div>


                      <div
                    key={index}
                    className="relative group " // gives vertical space for hover content above
                  >
                    {/* Hover card placed ABOVE the main card */}
                    <div className="absolute bottom-full mb-2 left-0 w-full flex justify-center z-20 hidden group-hover:flex">
                      <div className="w-full bg-gray-300 rounded-lg p-2 shadow-2xl">
                        {/* <ObjViewer url =  /> */}
                      </div>
                    </div>

                    {/* Main truck card */}
                    <div className="bg-gray-800 text-gray-200 px-6 py-3 rounded-lg shadow-lg transition-all group-hover:shadow-blue-500/50">
                        <h3 className="font-bold text-sm">{`Cargo type-${index + 1}`}</h3>
                       <p className="text-xs">Quantity: {cargo.quantity}</p>
                       <p className="text-xs">
                         LBH: {cargo.length}m x {cargo.breadth}m x {cargo.height}m
                       </p>
                       <p className="text-xs">Weight: {cargo.weight}kg</p>
                    </div>
                  </div>
                  ) : (
                    <p key={index} className="text-gray-500">{cargoId}</p>
                  );
                })
              ) : (
                <p className="text-gray-500">No cargo available</p>
              )}
            </div>
          </div>
        </div>


      </div>

     
  
      {/* Submit Button */}
      <div className="box relative">
        <button
          className="bg-white text-black py-2 px-6 rounded-full shadow-lg hover:transform hover:scale-105 transition-all duration-200 absolute bottom-4 left-1/2 transform -translate-x-1/2"
          onClick={handleClick}
          disabled={loading2}
        >
          Submit
        </button>
      </div>


      <style jsx>{`
  .loader {
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`}</style>

    </div>
  );
  
};

export default DataInterpreted;
