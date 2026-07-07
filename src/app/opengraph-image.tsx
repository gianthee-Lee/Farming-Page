import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const alt = '프리미엄 쉼터';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';
export const revalidate = 0;

export default async function Image() {
  const siteInfo = await prisma.siteInfo.findUnique({ where: { id: 1 } });
  const text = siteInfo?.introText || '온전한 쉼을 위한 공간, 여행';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 60,
            color: '#111827',
            letterSpacing: '-0.02em',
            fontWeight: 300,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {text} <span style={{ color: '#111827', marginLeft: 12, fontWeight: 300 }}>|</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
