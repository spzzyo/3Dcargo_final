import type { NextApiRequest, NextApiResponse } from 'next';
import { createChatThread } from '@/lib/message-service';// adjust import as per structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const thread = await createChatThread();
    return res.status(201).json(thread);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}
                