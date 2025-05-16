import { getCouchDb } from './couchdb';
import { IMyTruck } from '@/types/c_truck';


export async function createTruck(){
  console.log("has entered createTruck");

    const uniqueName = `Truck-${Date.now()}`
    const db = await getCouchDb();
    const truck: IMyTruck ={
        name:uniqueName, quantity:0, length:0, breadth:0, height:0, wt_capacity:0, type: "Truck"}

 
    const response = await db.insert(truck);
    return { ...truck, _id: response.id, _rev: response.rev };

  }


  export async function getTruck(truckID: string) {
    try {
        const db = await getCouchDb();
        const doc = await db.get(truckID) as IMyTruck;
        return {
            name: doc.name,
            length: doc.length,
            breadth: doc.breadth,
            height: doc.height,
            wt_capacity: doc.wt_capacity,
            quantity: doc.quantity,
          };      
         } catch (error) {
      console.error("Error fetching chat thread:", error);
      return null;
    }
  }
  
  
  export async function getAllTrucks() {
    const db = await getCouchDb();
    const result = await db.view("truck_views", "by_type");
    return result.rows.map(row => ({
      id: row.id,
      //name to be added 
    }));   
  }
  
  
  
  
  
  
  export async function updateTruck(truckID: string, updateData:Partial<IMyTruck>) {
 
      const db = await getCouchDb();
      try {
        const existing = await db.get(truckID);
        const updated = { ...existing, ...updateData, _rev: existing._rev }; 
        const response = await db.insert(updated);
        return { ...updated, _rev: response.rev };
      } catch (error) {
        console.error('Error updating cargo:', error);
        return null;
      }
      
  
  }