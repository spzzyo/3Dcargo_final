import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllThreads } from '@/lib/message-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const threads = await getAllThreads();
    return res.status(200).json(threads);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
