import { NextResponse } from 'next/server';
import { sampleChargers } from '@charge-spec/shared';
import { notFound } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Find charger by ID
  const charger = sampleChargers.find((c) => c.id === id);

  if (!charger) {
    notFound();
  }

  return NextResponse.json(charger);
}
