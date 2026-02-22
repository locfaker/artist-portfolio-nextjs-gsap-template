import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTNAMES = new Set(['cdn.sanity.io']);

function parseAllowedTarget(rawUrl: string): URL | null {
  const candidates = [rawUrl];

  try {
    const decoded = decodeURIComponent(rawUrl);
    if (!candidates.includes(decoded)) {
      candidates.push(decoded);
    }
  } catch {
    // Ignore decoding errors and keep raw candidate.
  }

  try {
    const decodedTwice = decodeURIComponent(candidates[candidates.length - 1]);
    if (!candidates.includes(decodedTwice)) {
      candidates.push(decodedTwice);
    }
  } catch {
    // Ignore decoding errors and keep existing candidates.
  }

  for (const candidate of candidates) {
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol === 'https:' && ALLOWED_HOSTNAMES.has(parsed.hostname)) {
        return parsed;
      }
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  if (!rawUrl) {
    return new NextResponse('Missing "url" query parameter.', { status: 400 });
  }

  const target = parseAllowedTarget(rawUrl);
  if (!target) {
    return new NextResponse('Unsupported asset URL.', { status: 400 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      next: { revalidate: 86400 },
    });

    if (!upstream.ok || !upstream.body) {
      return new NextResponse('Asset unavailable.', { status: 502 });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch {
    return new NextResponse('Failed to load asset.', { status: 502 });
  }
}
