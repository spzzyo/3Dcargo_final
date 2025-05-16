import { getCouchDb } from './couchdb';
import { IMyCargo } from '@/types/c_cargo';

export async function createCargo(): Promise<IMyCargo> {
  const db = await getCouchDb();
  const cargo: IMyCargo = {
    quantity: 0,
    length: 0,
    breadth: 0,
    height: 0,
    weight: 0,

  };
  const documentToInsert = {
    ...cargo,
    type: "CargoBox", 
  };
  const response = await db.insert(documentToInsert);
  return { ...cargo, _id: response.id, _rev: response.rev };
}

export async function createCargowithData(data: Partial<IMyCargo>): Promise<IMyCargo> {
  const db = await getCouchDb();
  const cargo: IMyCargo = {

    quantity: data.quantity ?? 0,
    length: data.length ?? 0,
    breadth: data.breadth ?? 0,
    height: data.height ?? 0,
    weight: data.weight ?? 0,
    type: "CargoBox",
  };


  const response = await db.insert(cargo);
  return { ...cargo, _id: response.id, _rev: response.rev };
}

export async function getCargo(cargoID: string) {
  const db = await getCouchDb();
  try {
    const doc = await db.get(cargoID);
    return doc;
  } catch (error) {
    console.error('Error fetching cargo:', error);
    return null;
  }
}

export async function getAllCargos(): Promise<{ id: string}[]> {
  const db = await getCouchDb();
  const result = await db.view("cargo_views", "by_type");
  return result.rows.map(row => ({
    id: row.id,
   
  }));
}

export async function updateCargo(cargoID: string, updateData: Partial<IMyCargo>){
  const db = await getCouchDb();
  try {
    const existing = await db.get(cargoID);
    const updated = { ...existing, ...updateData };
    const response = await db.insert(updated);
    return { ...updated, _rev: response.rev };
  } catch (error) {
    console.error('Error updating cargo:', error);
    return null;
  }
}
