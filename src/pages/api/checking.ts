// File: /pages/api/userdata/truck.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createEmptyTruckObjs } from '@/lib/userData-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    console.log("incoming req");


    const { threadId } = req.body;
    console.log("json for truck", threadId);
    await createEmptyTruckObjs(threadId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add truck to user data' });
  }
}
