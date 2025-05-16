// File: /pages/api/userdata/[threadId].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getCompleteData } from '@/lib/userData-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Method Not Allowed');

  try {
    const { threadId } = req.query;
    const data = await getCompleteData(threadId as string);

    if (!data) {
      return res.status(404).json({ error: 'User data not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complete data' });
  }
}
