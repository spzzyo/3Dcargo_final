import { IUserData } from "@/types/c_userData";
import { getCouchDb } from "./couchdb";
import { createTruck } from "./truck-service";
import { IMyCargo } from "@/types/c_cargo";
import { createCargowithData } from "./cargo-service";

export const createUserDatas = async (thread: string) => {
    
    const db = await getCouchDb();
    const threadID = thread;
    const userData: IUserData ={
        threadID:threadID, type: "UserData", createdAt: Date.now(), updatedAt: Date.now(),trucks: [], cargoBoxes:[]}

 
    const response = await db.insert(userData);
    return { ...userData, _id: response.id, _rev: response.rev };

  }


  export const createEmptyTruckObjs = async(threadId: string) =>{
    const db = await getCouchDb();
    console.log("has entered createEmptyTruck");
      const newTruck = await createTruck();
      const result = await db.view('userData_views', 'by_threadID', {
        key: threadId,
        include_docs: true
      });

      const userDataDoc = (result.rows[0].doc) as IUserData;
      userDataDoc.trucks = [...(userDataDoc.trucks || []), newTruck._id];
        userDataDoc.updatedAt = Date.now();

    const response = await db.insert(userDataDoc);
    return ;
    
  };




  export const createCargoObjects = async(threadId: string, data: Partial<IMyCargo>) =>{
    const db = await getCouchDb();
      const newCargo = await createCargowithData(data);
      const result = await db.view('userData_views', 'by_threadID', {
        key: threadId,
        include_docs: true
      });
      if (!newCargo._id) {
        throw new Error("Cargo creation failed: _id is missing");
      }
      console.log("Cargobox created");
      const userDataDoc = (result.rows[0].doc) as IUserData;
      userDataDoc.cargoBoxes = [...(userDataDoc.cargoBoxes || []), newCargo._id];
        userDataDoc.updatedAt = Date.now();

        const response = await db.insert(userDataDoc);
        console.log("was userData updated",  userDataDoc.updatedAt);

        return ;
  }




  
  export async function getCompleteData(
    threadId: string
  ): Promise<{ threadID: string; trucks: string[]; cargoBoxes: string[] } | null> {
    try {
        const db = await getCouchDb();
        const result = await db.view('userData_views', 'by_threadID', {
          key: threadId,
          include_docs: true
        });
        const userData = (result.rows[0].doc) as IUserData;
  
      return {
        threadID: userData.threadID,
        trucks: userData.trucks?? [],
        cargoBoxes: userData.cargoBoxes ?? [],
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return null;
    }
  }
  
    
  
  