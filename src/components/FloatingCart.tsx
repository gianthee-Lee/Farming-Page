'use client';

import { useState } from 'react';

type Crop = {
  id: number;
  name: string;
  price: string;
};

type CartItem = {
  crop: Crop;
  quantity: number;
};

type FloatingCartProps = {
  cartName: string;
  cartItems: CartItem[];
  updateQuantity: (cropId: number, delta: number) => void;
  removeItem: (cropId: number) => void;
  clearCart: () => void;
};

export default function FloatingCart({ cartName, cartItems, updateQuantity, removeItem, clearCart }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phoneNumber: phone,
          items: cartItems.map(item => ({ cropId: item.crop.id, quantity: item.quantity }))
        })
      });
      if (res.ok) {
        alert('예약이 성공적으로 접수되었습니다!');
        clearCart();
        setShowModal(false);
        setIsOpen(false);
        setName('');
        setPhone('');
      } else {
        alert('예약 접수 중 오류가 발생했습니다.');
      }
    } catch (err) {
      alert('예약 접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <>
      {/* Floating Button / Cart Panel */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        
        {isOpen && (
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '300px', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ background: '#10b981', color: 'white', padding: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🛒 {cartName}</span>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            
            <div style={{ padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {cartItems.map(item => (
                <div key={item.crop.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{item.crop.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>{item.crop.price}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => updateQuantity(item.crop.id, -1)} style={{ padding: '0.2rem 0.5rem', border: '1px solid #ccc', background: 'white', borderRadius: '0.25rem', cursor: 'pointer' }}>-</button>
                    <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.crop.id, 1)} style={{ padding: '0.2rem 0.5rem', border: '1px solid #ccc', background: 'white', borderRadius: '0.25rem', cursor: 'pointer' }}>+</button>
                    <button onClick={() => removeItem(item.crop.id)} style={{ padding: '0.2rem 0.5rem', border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '0.25rem', cursor: 'pointer', marginLeft: '0.5rem' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ padding: '1rem', background: '#f9fafb', borderTop: '1px solid #eee' }}>
              <button 
                onClick={() => setShowModal(true)}
                style={{ width: '100%', padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
              >
                예약하기
              </button>
            </div>
          </div>
        )}

        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            style={{ 
              width: '60px', height: '60px', borderRadius: '50%', background: '#10b981', color: 'white', border: 'none', 
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', position: 'relative'
            }}
          >
            🛒
            <span style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white', fontSize: '0.75rem', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>
              {cartItems.length}
            </span>
          </button>
        )}
      </div>

      {/* Reservation Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', width: '90%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>예약자 정보 입력</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>이름</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} placeholder="홍길동" />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>연락처</label>
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} placeholder="010-0000-0000" />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', background: '#e5e7eb', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>취소</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  {isSubmitting ? '처리 중...' : '예약 접수'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
