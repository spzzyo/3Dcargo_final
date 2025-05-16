import type { NextApiRequest, NextApiResponse } from 'next';
import { createTruck, getAllTrucks } from '@/lib/truck-service';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body;
    const truck = await createTruck();
    res.status(201).json(truck);
  } else if (req.method === 'GET') {
    const cargos = await getAllTrucks();
    res.status(200).json(cargos);
  } else {
    res.status(405).end();
  }
}
