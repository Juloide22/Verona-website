import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Path to config/viewer360.json
    const filePath = path.join(process.cwd(), 'config', 'viewer360.json');
    
    // Save to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log('[API] viewer360.json updated successfully.');
    
    return NextResponse.json({ success: true, message: 'Configuration saved successfully.' });
  } catch (error: any) {
    console.error('[API] Error saving config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
