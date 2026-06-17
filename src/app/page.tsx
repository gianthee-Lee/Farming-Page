import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import CropsAndCart from '@/components/CropsAndCart';

export const revalidate = 0; // Disable caching for simple CMS updates

export default async function Home() {
  const siteInfo = await prisma.siteInfo.findUnique({ where: { id: 1 } }) || {
    farmName: '행복한 농장',
    farmIntro: '신선하고 맛있는 농작물을 재배하는 행복한 농장입니다.',
    farmImage: null,
    heroNotice: '',
    cartName: '쇼핑 카트',
    cabinIntro: '아늑하고 편안한 쉼터, 저희 농장의 농막을 소개합니다.',
    cabinImage: null,
    phoneNumber: '010-0000-0000',
    kakaoLink: '#',
    address: '강원도 어딘가 멋진 농장',
  };

  const crops = await prisma.crop.findMany({
    orderBy: [
      { isAvailable: 'desc' },
      { createdAt: 'desc' }
    ],
  });

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            {siteInfo.farmImage ? (
              <Image
                src={siteInfo.farmImage}
                alt="Farm Background"
                fill
                className={styles.heroImage}
                priority
              />
            ) : (
              <div style={{ backgroundColor: 'var(--primary)', width: '100%', height: '100%' }} />
            )}
            <div className={styles.heroOverlay} />
          </div>
          <div className={`${styles.heroContent} animate-fade-in`}>
            <h1 className={styles.heroTitle}>{siteInfo.farmName}</h1>
            <p className={styles.heroDesc}>{siteInfo.farmIntro}</p>
            {siteInfo.heroNotice && (
              <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ffedd5', fontSize: '1.1rem', backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.5rem 1rem', borderRadius: '0.5rem', backdropFilter: 'blur(4px)' }}>
                {siteInfo.heroNotice}
              </p>
            )}
            <Link href="/cabin" className="btn btn-primary" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.4)', marginTop: '0.5rem', color: 'white' }}>
              🏡 농막 구경하기
            </Link>
          </div>
        </section>

        {/* Crops Section with Shopping Cart */}
        <CropsAndCart crops={crops} cartName={siteInfo.cartName || "쇼핑 카트"} />
      </main>

      {/* Footer / Contact Section */}
      <footer style={{ backgroundColor: '#1f2937', color: '#f3f4f6', padding: '4rem 0', textAlign: 'center' }}>
        <div className={styles.container}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>문의 및 오시는 길</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            {siteInfo.address && (
              <div style={{ width: '100%', maxWidth: '600px', height: '300px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.5rem', border: '1px solid #374151', backgroundColor: '#374151' }}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(siteInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d1d5db' }}>
              <MapPin size={20} />
              <span>{siteInfo.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d1d5db' }}>
              <Phone size={20} />
              <span>{siteInfo.phoneNumber}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`tel:${(siteInfo.phoneNumber || '').replace(/[^0-9]/g, '')}`} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <Phone className={styles.iconWrapper} size={20} />
              전화 연결
            </a>
            <a href={siteInfo.kakaoLink} target="_blank" rel="noopener noreferrer" className="btn btn-kakao" style={{ padding: '0.75rem 2rem' }}>
              <MessageCircle className={styles.iconWrapper} size={20} />
              카카오톡 상담
            </a>
          </div>
          
          <p style={{ marginTop: '3rem', fontSize: '0.875rem', color: '#6b7280' }}>
            &copy; {new Date().getFullYear()} {siteInfo.farmName}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
