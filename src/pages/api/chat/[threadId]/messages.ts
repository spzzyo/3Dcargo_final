import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllMessages } from '@/lib/message-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { threadId } = req.query;

  if (req.method === 'GET') {
    const messages = await getAllMessages(threadId as string);
    if (!messages) {
      return res.status(404).json({ error: 'Messages not found' });
    }
    return res.status(200).json(messages);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
