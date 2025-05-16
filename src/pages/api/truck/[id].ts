import type { NextApiRequest, NextApiResponse } from 'next';
import { getTruck, updateTruck } from '@/lib/truck-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const truck = await getTruck(id);
    if (!truck) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(truck);
  } else if (req.method === 'PUT') {
    const updated = await updateTruck(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found or failed to update' });
    return res.status(200).json(updated);
  } else {
    res.status(405).end();
  }
}
