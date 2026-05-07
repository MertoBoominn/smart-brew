import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { message, payload, level = 'info' } = data;
    
    // Format the log for Vercel/server console
    const logString = `\n=========================================\n[SERVER LOG] ${message}\n${payload ? JSON.stringify(payload, null, 2) : ''}\n=========================================\n`;
    
    if (level === 'error') {
      console.error(logString);
    } else if (level === 'warn') {
      console.warn(logString);
    } else {
      console.log(logString);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SERVER LOG] Error processing log:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
