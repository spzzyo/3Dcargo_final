import type { NextApiRequest, NextApiResponse } from 'next';
import { createCargowithData, getAllCargos } from '@/lib/cargo-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body;
    const cargo = await createCargowithData(data);
    res.status(201).json(cargo);
  } else if (req.method === 'GET') {
    const cargos = await getAllCargos();
    res.status(200).json(cargos);
  } else {
    res.status(405).end();
  }
}
