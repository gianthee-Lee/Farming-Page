'use client';

import Image from 'next/image';

export default function CabinCarousel({ images }: { images: string[] }) {
  if (!images || images.length === 0) {
    return (
      <div style={{ backgroundColor: '#e5e7eb', width: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' }}>
        <span style={{ color: '#9ca3af' }}>No Image</span>
      </div>
    );
  }

  const scrollLeft = () => {
    document.getElementById('visitor-cabin-scroll')?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    document.getElementById('visitor-cabin-scroll')?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {images.length > 4 && (
        <>
          <button 
            onClick={scrollLeft}
            style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '1px solid #ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          >
            ◀
          </button>
          <button 
            onClick={scrollRight}
            style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '1px solid #ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          >
            ▶
          </button>
        </>
      )}
      <div id="visitor-cabin-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '1rem', scrollSnapType: 'x mandatory', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {images.map((img, idx) => (
          <div key={idx} style={{ flex: '0 0 calc(25% - 0.75rem)', minWidth: '200px', scrollSnapAlign: 'start', position: 'relative', minHeight: '300px', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <Image src={img} alt={`Cabin ${idx}`} fill style={{ objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
