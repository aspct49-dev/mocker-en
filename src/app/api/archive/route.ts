import { revalidatePath, revalidateTag } from 'next/cache';

import { runArchive } from '@/lib/archive/archiver';
import { archiveMode } from '@/lib/archive/store';

/**
 * The archive job. Vercel Cron calls this once a day (vercel.json) with
 * `Authorization: Bearer <CRON_SECRET>`; on Vercel, any other caller is
 * refused. Locally it can be called by hand to test the whole flow.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (process.env.VERCEL && (!secret || request.headers.get('authorization') !== `Bearer ${secret}`)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (archiveMode() === 'off') {
    return Response.json(
      { error: 'No Blob store: connect one to the project in Vercel to keep past races.' },
      { status: 503 },
    );
  }

  const report = await runArchive();
  revalidateTag('archive');
  revalidatePath('/', 'layout');
  return Response.json({ ok: true, mode: archiveMode(), report });
}
