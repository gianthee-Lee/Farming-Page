import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import CropsAndCart from '@/components/CropsAndCart';
import IntroAnimation from '@/components/IntroAnimation';

export const revalidate = 0; // Disable caching for simple CMS updates

export default async function Home() {
  const siteInfo = await prisma.siteInfo.findUnique({ where: { id: 1 } }) || {
    farmName: '행복한 농장',
    farmIntro: '신선하고 맛있는 농작물을 재배하는 행복한 농장입니다.',
    introText: '온전한 쉼을 위한 공간, 여행',
    farmImage: null,
    heroNotice: '',
    cartName: '쇼핑 카트',
    cabinIntro: '아늑하고 편안한 쉼터, 저희 농장의 농막을 소개합니다.',
    cabinImage: null,
    cabinImages: '[]',
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

  let cabinImagesList: string[] = [];
  try {
    cabinImagesList = JSON.parse(siteInfo.cabinImages);
  } catch(e) {}
  
  if (cabinImagesList.length === 0 && siteInfo.cabinImage) {
    cabinImagesList = [siteInfo.cabinImage];
  }

  return (
    <>
      <IntroAnimation text={siteInfo.introText || '온전한 쉼을 위한 공간, 여행'} />
      
      <main style={{ backgroundColor: '#ffffff', color: '#111827' }}>
        
        {/* Luxury Hero Section (Cabin Focused) */}
        <section style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            {cabinImagesList.length > 0 ? (
              <Image
                src={cabinImagesList[0]}
                alt="Cabin Main"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : siteInfo.farmImage ? (
              <Image
                src={siteInfo.farmImage}
                alt="Farm Main"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundImage: "url('/hero-bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                animation: 'panDown 6s cubic-bezier(0.25, 1, 0.5, 1) 1.5s forwards'
              }} />
            )}
            {/* Elegant dark overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }} />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#ffffff', padding: '0 2rem' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '300', letterSpacing: '0.05em', marginBottom: '1.5rem', fontFamily: 'serif' }}>
              {siteInfo.farmName}
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: '300', letterSpacing: '0.1em', opacity: 0.9, marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
              {siteInfo.cabinIntro}
            </p>
            {siteInfo.heroNotice && (
              <p style={{ display: 'inline-block', fontSize: '0.875rem', letterSpacing: '0.05em', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '0.75rem 1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                {siteInfo.heroNotice}
              </p>
            )}
          </div>
        </section>

        {/* Minimalist Cabin Story Section */}
        {cabinImagesList.length > 1 && (
          <section style={{ padding: '8rem 2rem', backgroundColor: '#ffffff', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '300', letterSpacing: '0.1em', marginBottom: '4rem', fontFamily: 'serif' }}>THE SPACE</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {cabinImagesList.slice(1, 4).map((img, idx) => (
                <div key={idx} style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                  <Image src={img} alt={`Space ${idx+1}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Crops Section renamed to "Organic Market" */}
        <section id="organic-market" style={{ padding: '6rem 0', backgroundColor: '#fafafa', borderTop: '1px solid #eaeaea' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '300', letterSpacing: '0.05em', fontFamily: 'serif', color: '#111827' }}>
              오가닉 마켓
            </h2>
            <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '1rem', letterSpacing: '0.05em' }}>
              자연이 길러낸 건강한 재료, {siteInfo.farmName}의 프리미엄 셀렉션
            </p>
          </div>
          <CropsAndCart crops={crops} cartName={siteInfo.cartName || "쇼핑 카트"} />
        </section>

      </main>

      {/* Luxury Footer */}
      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '3rem', fontWeight: '300', letterSpacing: '0.1em', color: '#ffffff', fontFamily: 'serif' }}>
            {siteInfo.farmName}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
            {siteInfo.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '300', letterSpacing: '0.05em' }}>
                <MapPin size={16} />
                <span>{siteInfo.address}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '300', letterSpacing: '0.05em' }}>
              <Phone size={16} />
              <span>{siteInfo.phoneNumber}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <a href={`tel:${(siteInfo.phoneNumber || '').replace(/[^0-9]/g, '')}`} 
               style={{ padding: '1rem 2.5rem', border: '1px solid #4b5563', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'background-color 0.3s' }}>
              <Phone size={18} />
              전화 문의
            </a>
            <a href={siteInfo.kakaoLink} target="_blank" rel="noopener noreferrer" 
               style={{ padding: '1rem 2.5rem', backgroundColor: '#FEE500', color: '#000000', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <MessageCircle size={18} />
              카카오톡 상담
            </a>
          </div>
          
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            &copy; {new Date().getFullYear()} {siteInfo.farmName}. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes panDown {
          0% { background-position: top center; }
          100% { background-position: bottom center; }
        }
      `}} />
    </>
  );
}
