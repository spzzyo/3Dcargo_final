// File: /pages/api/userdata/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createUserDatas } from '@/lib/userData-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const { threadId } = req.body;
    console.log("within user data", threadId);
    const userData = await createUserDatas(threadId);
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user data' });
  }
}
