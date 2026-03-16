
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd());
    const fileContents = await fs.readFile(jsonDirectory + '/mock-data.json', 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    console.error('Error reading mock data:', error);
    return NextResponse.json({ error: 'Failed to load mock data' }, { status: 500 });
  }
}
