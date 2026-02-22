import { NextResponse } from 'next/server';

type SanityCover = {
  _id?: string;
  title?: string;
  date?: string;
  type?: string;
  image?: string;
  imageAlt?: string;
};

const SANITY_QUERY = `
  *[_type == "cover"] | order(date desc) {
    _id,
    title,
    date,
    type,
    "image": image.asset->url,
    "imageAlt": image.alt
  }
`;

function toProxyAssetUrl(imageUrl: string): string {
  try {
    const parsed = new URL(imageUrl);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'cdn.sanity.io') {
      return imageUrl;
    }
    return `/api/media/asset?url=${encodeURIComponent(parsed.toString())}`;
  } catch {
    return imageUrl;
  }
}

export async function GET() {
  const cacheHeader = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
  };

  try {
    const params = new URLSearchParams({
      query: SANITY_QUERY,
      returnQuery: 'false',
    });
    const response = await fetch(
      `https://xgykflrm.apicdn.sanity.io/v2024-01-01/data/query/production?${params.toString()}`,
      {
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ result: [] }, { headers: cacheHeader });
    }

    const payload = (await response.json()) as { result?: SanityCover[] };
    const proxiedResult = (payload.result ?? []).map((item) => ({
      ...item,
      image: item.image ? toProxyAssetUrl(item.image) : item.image,
    }));

    return NextResponse.json({ result: proxiedResult }, { headers: cacheHeader });
  } catch {
    return NextResponse.json({ result: [] }, { headers: cacheHeader });
  }
}
