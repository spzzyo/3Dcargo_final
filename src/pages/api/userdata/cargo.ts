// File: /pages/api/userdata/cargo.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createCargoObjects } from '@/lib/userData-service';
import { IMyCargo } from '@/types/c_cargo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const { threadId, cargoData } = req.body as { threadId: string; cargoData: Partial<IMyCargo> };
    await createCargoObjects(threadId, cargoData);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add cargo to user data' });
  }
}
