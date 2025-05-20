import { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "querystring";




interface Response{
    replyBot : string, 
    nextZone : string,
    zone_retained : boolean,
    extraData?: { [key: string]: unknown }

}

// question, input in req ----> next question or end of conversation msg in response  

export default async function handler(req:NextApiRequest, res: NextApiResponse){

   
    const userMessage : string = req.body.inputMessage;
    const currentZone : string = req.body.currentZone; 
    const lastBotResponse : string = req.body.lastBotResponse;
    const isZoneInitiator : boolean = req.body.isZoneInitiator;
    const threadId : string = req.body.threadId;
    const extraData = req.body.extraData ; 

 
    // const data_from_memory = await fetch(`/api/userdata/${threadId}`, {
    //     method: 'GET',
    // });
    // const user_data = await data_from_memory.json();



    //Determine if zone is to be sustained or next zone

    const response:Response = await zoneDeterminer(currentZone,userMessage, lastBotResponse, isZoneInitiator, threadId, extraData)
    return res.json(response);
    

}


async function zoneDeterminer(currentZone: string, userMessage: string, lastBotResponse: string, isZoneInitiator: boolean, threadId : string, extraData: { [key: string]: unknown }){
    const zone = currentZone;
    
    switch (zone) {
        case "zone_introduction":     
        
        const func_response : Response = await func_introduction(currentZone, userMessage, lastBotResponse, isZoneInitiator, threadId);
        return func_response;


        // if (userMessage.toLowerCase() === "hi"){
        //     const resp : Response = {
        //         replyBot: "I'm a ChatBOT, here to help you with exploring 3D Cargo and make visualization effortless for you! Lets begin with your name. What should I call you?",
        //         nextZone : "zone_introduction",
        //         zone_retained : true
        //     }

        //     return resp;

        // }
        
        // //checking if adequate response received to previous question by some LLM 

        // const apiUrl = `http://10.119.11.41:8080/response_interpretation?prev_bot_question=${encodeURIComponent(lastBotResponse)}&user_message=${encodeURIComponent(userMessage)}`;
        // const response = await fetch(apiUrl, {
        // method: "POST",
        // headers: { "Accept": "application/json" },
        // body: "" 
        // });
        
        // const check = await response.json();
        // if (check.status === "adequate"){
        //     const resp : Response = {
        //         replyBot: check.message,
        //         nextZone : "zone_dataCollectionMode",
        //         zone_retained : false
        //     }

        //     return resp;
            
        // }
        // else if (check.status === "inadequate"){
        //     const resp : Response = {
        //         replyBot: check.message,
        //         nextZone : "zone_introduction",
        //         zone_retained : true
        //     }

        //     return resp;
        // }
        // else{
        //     const resp : Response = {
        //         replyBot: "Please try again later.",
        //         nextZone : "zone_introduction",
        //         zone_retained : true
        //     }

        //     return resp; 
        // }


        

        case "zone_dataCollectionMode":
        const funcDataresp : Response = await func_dataCollectionMode(currentZone, userMessage, lastBotResponse, isZoneInitiator, threadId);
        return funcDataresp;
        break;

       

        case "zone_vehicleTotalCount":
        const fvehicleTotalCount : Response = await func_vehicleTotalCount (currentZone, userMessage, lastBotResponse, isZoneInitiator, threadId);
        return fvehicleTotalCount;

      
        case "zone_vehicleDataInterpretation":
        const fvehicleDataInterpretation : Response = await func_vehicleDataInterpretation (currentZone, userMessage, lastBotResponse, isZoneInitiator, threadId, Number(extraData.vehicleCount));
        return fvehicleDataInterpretation;

            
        case "zone_cargoDataInterpretation":
        const fcargoDataInterpretation : Response = await func_cargoDataInterpretation (currentZone, userMessage, lastBotResponse, isZoneInitiator, threadId);
        return fcargoDataInterpretation;

        
        // case "zone_cargoDescription":
        
        // break;
        
          

        
        
        default:
        //handling any sense of ambiguity. 
        const resp : Response = {
            replyBot: "Please try again later.",
            nextZone : "zone_introduction",
            zone_retained : true
        }

        return resp; 
      }



}


async function func_introduction (currentZone: string, userMessage: string, lastBotResponse: string, isZoneInitiator: boolean, threadId: string){

    if (isZoneInitiator == true){
        const resp : Response = {
            replyBot: "I'm a ChatBOT, here to help you with exploring 3D Cargo and make visualization effortless for you! Lets begin with your name. What should I call you?",
            nextZone : "zone_introduction",
            zone_retained : true
        }

        return resp;

    }
    

    const apiUrl = `http://10.119.11.41:8080/response_interpretation?prev_bot_question=${encodeURIComponent(lastBotResponse)}&user_message=${encodeURIComponent(userMessage)}`;
    const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: "" 
    });
    
    const check = await response.json();
    if (check.status === "adequate"){
        
        const nextQ: Response = await func_dataCollectionMode("zone_dataCollectionMode", "", "", true, threadId)
        const mergedReply = check.message + nextQ.replyBot

        const resp : Response = {
            replyBot: mergedReply,
            nextZone : "zone_dataCollectionMode",
            zone_retained : true
        }

        return resp;
        
    }
    else if (check.status === "inadequate"){
        const resp : Response = {
            replyBot: check.message,
            nextZone : "zone_introduction",
            zone_retained : true
        }

        return resp;
    }
    else{
        const resp : Response = {
            replyBot: "Please try again later.",
            nextZone : "zone_introduction",
            zone_retained : true
        }

        return resp; 
    }
}




async function func_dataCollectionMode (currentZone: string, userMessage: string, lastBotResponse: string, isZoneInitiator: boolean, threadId: string){

    if (isZoneInitiator == true){
        const resp : Response = {
            replyBot: " Let's begin with vehicle containers! Would you like to pick containers from our database or describe your own custom vehicles?",
            nextZone : "zone_dataCollectionMode",
            zone_retained : false
        }

        return resp;

    }


    else {

        const apiUrl = `http://10.119.11.41:8080/dataCollectionMode?prev_bot_question=${encodeURIComponent(lastBotResponse)}&user_message=${encodeURIComponent(userMessage)}`;
        const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: "" 
        });
        
        const check = await response.json();
        if (check.status === "adequate"){


            if (check.description_mode === "custom_vehicle_description"){

                const nextQ: Response = await func_vehicleTotalCount("zone_vehicleTotalCount", "", "", true,threadId )
                const mergedReply = check.message + nextQ.replyBot


                const resp : Response = {
                    replyBot: mergedReply,
                    nextZone : "zone_vehicleTotalCount",
                    zone_retained : true
                }
        
                return resp; 
                
            }
            else if (check.description_mode === "vehicle_database_reference"){
                


                const res_truck = await fetch('http://localhost:3000/api/truck', {
                    method: 'GET',
                  });
      
                const allTrucks = await res_truck.json();
                const resp : Response = {
                    replyBot: check.message,
                    nextZone : "zone_cargoDataInterpretation",
                    zone_retained : true,
                    extraData: allTrucks

                }
        
                return resp; 

            }
            else {
                const resp : Response = {
                    replyBot: "Please try again later.",
                    nextZone : "zone_ambiguous",
                    zone_retained : false
                }
        
                return resp; 
            }
            
            
        }

        else if (check.status === "inadequate"){
            const resp : Response = {
                replyBot: check.message,
                nextZone : "zone_ambiguous",
                zone_retained : false
            }
    
            return resp;
        }
        else{
            const resp : Response = {
                replyBot: "Please try again later.",
                nextZone : "zone_ambiguous",
                zone_retained : false
            }
    
            return resp; 
        } 
        
    }





}




async function  func_vehicleTotalCount(currentZone: string, userMessage: string, lastBotResponse: string, isZoneInitiator: boolean,threadId : string){
    if (isZoneInitiator == true){
        const resp : Response = {
            replyBot: " Great! Can you start by providing me with the number of vehicles you have?",
            nextZone : "zone_vehicleTotalCount",
            zone_retained : false
        }

        return resp;

    }

    
    else {

        const apiUrl = `http://10.119.11.41:8080/vehicleCount?prev_bot_question=${encodeURIComponent(lastBotResponse)}&user_message=${encodeURIComponent(userMessage)}`;
        const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: "" 
        });
        
        const check = await response.json();
        if (check.status === "adequate"){
            const vehicleCount = check.vehicle_count;
            console.log("vehicle count was extracted? ", vehicleCount);
            
            // await Promise.all(
            //     Array.from({ length: vehicleCount }).map(async () => {
            //       try {
            //         const res = await fetch(`http://localhost:3000/api/userdata/truck`, {
            //           method: 'POST',
            //           headers: {
            //             'Content-Type': 'application/json',
            //           },
            //           body: JSON.stringify({ threadId }), 
            //         });
              
            //         console.log(`${vehicleCount} empty trucks created.`);
                    
            //       } catch (error) {
            //         console.error(error, 'error');
            //       }
            //     })
            //   );


              for (let i = 0; i < vehicleCount; i++) {
                try {
                  const res = await fetch(`http://localhost:3000/api/userdata/truck`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ threadId }),
                  });
                  console.log(`Truck ${i + 1} created`);
                } catch (error) {
                  console.error(error, 'error');
                }
              }

            const nextQ: Response = await func_vehicleDataInterpretation("zone_vehicleDataInterpretation", "", "", true,threadId,vehicleCount)
            const mergedReply = check.message + nextQ.replyBot


            const resp : Response = {
                replyBot: mergedReply , 
                nextZone : "zone_vehicleDataInterpretation",
                zone_retained : true,
                extraData : nextQ.extraData
            }
    
            return resp;
            
        }

        else if (check.status === "inadequate"){
            const resp : Response = {
                replyBot: check.message,
                nextZone : "zone_ambiguous",
                zone_retained : false
            }
    
            return resp;
        }
        else{
            const resp : Response = {
                replyBot: "Please try again later.",
                nextZone : "zone_ambiguous",
                zone_retained : false
            }
    
            return resp; 
        } 
        
    }


}



const sendVehicleDescription = async (message: string, length: number | null, breadth: number | null, height: number | null, wt_capacity: number | null, quantity: string | null, name: string | null, currentTruckID: string ) => {
    const data = {
      Inside_Dimensions_Length: length,
      Inside_Dimensions_Width: breadth,
      Inside_Dimensions_Height: height,
      Max_Cargo_Weight: wt_capacity,
      Model_Name: name,
      Vehicle_Quantity: quantity
    };
  
    const description_apiUrl = `http://10.119.11.41:8080/vehicle_description_flow?query=${encodeURIComponent(message)}&data=${encodeURIComponent(JSON.stringify(data))}`;
  
   
    const response = await fetch(description_apiUrl, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: "" 
    });
  
    const response_data = await response.json();
    console.log("API response would be ", response_data);
    const filteredData = Object.fromEntries(
      Object.entries(response_data.data).filter(([_, value]) => value !== null)
    );
    
    console.log("filteredData", filteredData);
    try {
      const res = await fetch(`http://localhost:3000/api/truck/${currentTruckID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
      });
      const wasUpdated = await res.json();
      console.log("was my truck updated;", wasUpdated);

    }catch(error){
      console.log("Unable to update");
    }

    // const wasUpdated = await updateTruck(currentTruckID, filteredData);

    return response_data;

  };
  

  const transformData = (data: any) => {
    return {
        length: data.length === 0 ? null : data.length,
        breadth: data.breadth === 0 ? null : data.breadth,
        height: data.height === 0 ? null : data.height,
        wt_capacity: data.wt_capacity === 0 ? null : data.wt_capacity,
        quantity: data.quantity === 0 ? null : data.quantity,
        name: null
    };
};



async function  func_vehicleDataInterpretation(currentZone: string, userMessage: string, lastBotResponse: string, isZoneInitiator: boolean, threadId : string, vehicleCount: number){
    if (isZoneInitiator == true){
        const resp : Response = {
            replyBot: "Please help us with describing each of your vehicles one by one. Lets begin with the first one - Please provide its dimensions, weight capacity and the number of units you have of this type.",
            nextZone : "zone_vehicleDataInterpretation",
            zone_retained : false,
            extraData: {vehicleCount}
        }
        return resp;
    }

    
    else {
        if (vehicleCount > 0){

        const res = await fetch(`http://localhost:3000/api/userdata/${threadId}`, {
            method: 'GET',
        });
    
        if (!res.ok) {
        throw new Error(`Failed to create truck: ${res.status}`);
        }
        
        const data =  await res.json(); 
const truckIds = data?.trucks?.map((id: string | number) => String(id)) ?? [];

        const truckId = truckIds[vehicleCount-1]

        const res_truck = await fetch(`http://localhost:3000/api/truck/${truckId}`, {
            method: 'GET',
          });

        const currentTruck = await res_truck.json();
        console.log("current truck is ", currentTruck);

        const transformed_data = transformData(currentTruck);
        const api_response = await sendVehicleDescription(userMessage,transformed_data.length, transformed_data.breadth, transformed_data.height, transformed_data.wt_capacity, transformed_data.quantity, transformed_data.name, truckId! )
        
        if (api_response.status === "incomplete") 
            {

                const resp : Response = {
                    replyBot: api_response.response,
                    nextZone : "zone_vehicleDataInterpretation",
                    zone_retained : true,
                    extraData: {"vehicleCount":vehicleCount }
                }

               
        
                return resp;
        }
        else if (api_response.status === "complete"){
            if (vehicleCount == 1){
                
                const nextQ: Response = await func_cargoDataInterpretation("zone_cargoDataInterpretation", "", "", true,threadId)
        
                const resp : Response = {
                    replyBot:  api_response.response + nextQ.replyBot ,
                    nextZone : "zone_cargoDataInterpretation",
                    zone_retained : true,
                        
                }
    
                return resp;

            }

            else {

                const resp : Response = {
                    replyBot:  api_response.response + " Similarly, describe the next vehcile fleet.  Please provide its dimensions, weight capacity and the number of units you have in this fleet.",
                    nextZone : "zone_vehicleDataInterpretation",
                    zone_retained : true,
                    extraData: {"vehicleCount":vehicleCount-1 }

                        
                }
    
                return resp;

            }


            
        }

        else {
            const resp : Response = {
                replyBot: "Please try again later.",
                nextZone : "zone_ambiguous",
                zone_retained : false
            }
    
            return resp; 

        }

        
        

    }

    else {
        
        
        const nextQ: Response = await func_cargoDataInterpretation("zone_cargoDataInterpretation", "", "", true,threadId)
        
        const resp : Response = {
            replyBot: nextQ.replyBot ,
            nextZone : "zone_cargoDataInterpretation",
            zone_retained : true,
                
        }
    
        return resp;
    }
        


    }


}


async function  func_cargoDataInterpretation(currentZone: string, userMessage: string, lastBotResponse: string, isZoneInitiator: boolean, threadId : string){

    if (isZoneInitiator == true){
        const resp : Response = {
            replyBot: " Now please provide details about the first kind of your cargo boxes like their dimensions and quantity.",
            nextZone : "zone_cargoDataInterpretation",
            zone_retained : false,
           

        }

        return resp;

    }


    else {
        const description_apiUrl = `http://10.119.11.41:8080/cargo_description_flow?query=${encodeURIComponent(userMessage)}`;
  
   
        const response = await fetch(description_apiUrl, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: "" 
        });
  
        const api_response = await response.json();

        console.log("api responses::", api_response)

        const formattedCargo = {
          quantity: api_response.Cargo_Quantity,
          length: api_response.Cargo_Length,
          breadth: api_response.Cargo_Width,
          height: api_response.Cargo_Height,
          weight: api_response.Cargo_Weight,
        };


        try {
          const res = await fetch(`http://localhost:3000/api/userdata/cargo`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              threadId: threadId,
              cargoData: formattedCargo
            }),
          });
          const objCreated = await res.json();
          console.log("object Created:", objCreated);
          
    
        }catch(error){
          console.log(error, "Unable to update");
        }
    
    

          const resp : Response = {
            replyBot: "Okay got that! Please describe other kinds of cargo boxes you may have.",
            nextZone : "zone_cargoDataInterpretation",
            zone_retained : true,
           

        }

        return resp;

          

    }



}
