import { NextResponse } from 'next/server';

/**
 * Stub for future video ingredient detection.
 * Plan: accept video upload, extract 3-5 frames (e.g. via fluent-ffmpeg on server),
 * run vision on each frame, merge and deduplicate ingredients.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Video detection is not implemented yet. Use a photo and POST /api/detect.' },
    { status: 501 }
  );
}
