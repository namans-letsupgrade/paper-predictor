import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PredictedPaper } from '@/lib/models/PredictedPaper';

/**
 * GET /api/paper/[id]
 * Returns a predicted paper by its MongoDB _id.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();
    const paper = await PredictedPaper.findById(id).lean();

    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    return NextResponse.json({ paper });
  } catch (err) {
    console.error('[paper GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
