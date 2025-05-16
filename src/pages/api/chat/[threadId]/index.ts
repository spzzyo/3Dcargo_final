import type { NextApiRequest, NextApiResponse } from 'next';
import { getChatThread } from '@/lib/message-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { threadId } = req.query;

  if (req.method === 'GET') {
    const thread = await getChatThread(threadId as string);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    return res.status(200).json(thread);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
