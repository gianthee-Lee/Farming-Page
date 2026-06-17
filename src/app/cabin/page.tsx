import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import styles from '../page.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CabinCarousel from './CabinCarousel';

export const revalidate = 0;

export default async function CabinPage() {
  const siteInfo = await prisma.siteInfo.findUnique({ where: { id: 1 } }) || {
    cabinIntro: '아늑하고 편안한 쉼터, 저희 농장의 농막을 소개합니다.',
    cabinImage: null as string | null,
    cabinImages: '[]',
  };

  let parsedCabinImages = [];
  try {
    parsedCabinImages = JSON.parse(siteInfo.cabinImages || "[]");
  } catch(e){}
  if (parsedCabinImages.length === 0 && siteInfo.cabinImage) {
    parsedCabinImages = [siteInfo.cabinImage];
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <header style={{ padding: '2rem 0', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
        <div className={styles.container}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
            <ArrowLeft size={20} /> 메인으로 돌아가기
          </Link>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>우리의 농막</h1>
          <div className={styles.cabinGrid}>
            <CabinCarousel images={parsedCabinImages} />
            <div className={styles.cabinText}>
              <p>{siteInfo.cabinIntro}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
