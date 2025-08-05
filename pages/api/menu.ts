import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchMenuWithOptions } from '@/lib/google';
import type { MenuRow, MenuLayout } from '@/lib/google';

interface MenuApiResponse {
  rows: MenuRow[];
  layout: MenuLayout;
  packmanText: string;
  timestamp: number;
}

interface ApiError {
  error: string;
  timestamp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MenuApiResponse | ApiError>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      timestamp: Date.now() 
    });
  }

  try {
    console.log('[API] Fetching fresh menu data...');
    const { rows, layout, packmanText } = await fetchMenuWithOptions();
    
    const response: MenuApiResponse = {
      rows,
      layout,
      packmanText,
      timestamp: Date.now(),
    };

    // Cache for 30 seconds
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    res.status(200).json(response);
    
    console.log(`[API] Successfully fetched ${rows.length} menu items`);
  } catch (error) {
    console.error('[API] Error fetching menu data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch menu data', 
      timestamp: Date.now() 
    });
  }
}