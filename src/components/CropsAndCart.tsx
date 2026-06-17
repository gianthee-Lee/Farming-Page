'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/app/page.module.css';
import FloatingCart from './FloatingCart';

type Crop = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string | null;
  isAvailable: boolean;
};

export default function CropsAndCart({ crops, cartName }: { crops: Crop[], cartName: string }) {
  const [cartItems, setCartItems] = useState<{ crop: Crop, quantity: number }[]>([]);

  const addToCart = (crop: Crop) => {
    if (!crop.isAvailable) return;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.crop.id === crop.id);
      if (existing) {
        if (existing.quantity >= 10) {
          alert('최대 10개까지만 담을 수 있습니다.');
          return prev;
        }
        return prev.map(item => item.crop.id === crop.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { crop, quantity: 1 }];
    });
  };

  const updateQuantity = (cropId: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.crop.id === cropId) {
        const newQ = item.quantity + delta;
        if (newQ >= 1 && newQ <= 10) return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeItem = (cropId: number) => {
    setCartItems(prev => prev.filter(item => item.crop.id !== cropId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <>
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>판매 중인 농작물</h2>
          <div className={styles.cropsGrid}>
            {crops.length > 0 ? (
              crops.map((crop) => (
                <div 
                  key={crop.id} 
                  className={`${styles.cropCard} ${!crop.isAvailable ? styles.soldOutCard : ''}`}
                  onClick={() => addToCart(crop)}
                  style={{ cursor: crop.isAvailable ? 'pointer' : 'default' }}
                  title={crop.isAvailable ? '클릭하여 장바구니에 담기' : '품절'}
                >
                  <div className={styles.cropImageWrapper}>
                    {crop.image ? (
                      <Image
                        src={crop.image}
                        alt={crop.name}
                        fill
                        className={styles.heroImage}
                      />
                    ) : (
                      <div style={{ backgroundColor: '#e5e7eb', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ color: '#9ca3af' }}>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.cropContent}>
                    <div className={styles.cropTitleWrapper}>
                      <h3 className={styles.cropTitle}>{crop.name}</h3>
                      <div className={`${styles.cropBadge} ${crop.isAvailable ? styles.badgeAvailable : styles.badgeSoldOut}`}>
                        {crop.isAvailable ? '판매중' : '품절'}
                      </div>
                    </div>
                    <p className={styles.cropDesc}>{crop.description}</p>
                    <p className={styles.cropPrice}>{crop.price}</p>
                    {crop.isAvailable && (
                      <div style={{ marginTop: '0.5rem', textAlign: 'right', fontSize: '0.875rem', color: '#10b981', fontWeight: 'bold' }}>
                        + 카트에 담기
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                현재 등록된 농작물이 없습니다.
              </p>
            )}
          </div>
        </div>
      </section>
      
      <FloatingCart 
        cartName={cartName} 
        cartItems={cartItems} 
        updateQuantity={updateQuantity} 
        removeItem={removeItem} 
        clearCart={clearCart} 
      />
    </>
  );
}
