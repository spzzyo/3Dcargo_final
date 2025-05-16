import type { NextApiRequest, NextApiResponse } from 'next';
import { saveMessage } from '@/lib/message-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { threadId } = req.query;

  if (req.method === 'POST') {
    const { role, content, msg_function } = req.body;

    if (!role || !content || !msg_function) {
      return res.status(400).json({ error: 'Missing message fields' });
    }

    await saveMessage(threadId as string, role, content, msg_function);
    return res.status(200).json({ message: 'Message saved' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
