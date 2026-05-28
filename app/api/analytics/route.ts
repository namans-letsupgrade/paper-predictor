import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PredictionJob } from '@/lib/models/PredictionJob';
import { CBSE_CLASS10_MATHS_SEED } from '@/lib/seed/cbse-class10-maths';

/**
 * GET /api/analytics?board=CBSE&cls=10&subject=Mathematics
 * Returns chapter analytics and insights for the prediction dashboard.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const board = searchParams.get('board');
  const cls = searchParams.get('cls');
  const subject = searchParams.get('subject');

  if (!board || !cls || !subject) {
    return NextResponse.json({ error: 'board, cls, subject required' }, { status: 400 });
  }

  try {
    await connectDB();

    const job = await PredictionJob.findOne({ board, class: cls, subject, status: 'complete' })
      .sort({ updatedAt: -1 })
      .lean();

    if (job) {
      return NextResponse.json({ found: true, job });
    }

    // Return seed data as fallback for CBSE Cl.10 Maths
    if (board === 'CBSE' && cls === '10' && subject === 'Mathematics') {
      return NextResponse.json({ found: false, seed: CBSE_CLASS10_MATHS_SEED });
    }

    return NextResponse.json({ found: false, seed: null });
  } catch (err) {
    console.error('[analytics GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
