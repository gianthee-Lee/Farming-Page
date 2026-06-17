'use client';

import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: 'var(--primary-dark)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>농장 관리자 페이지</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#d8f3dc', cursor: 'pointer', textDecoration: 'underline' }}>
            사이트로 돌아가기
          </button>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
            로그아웃
          </button>
        </div>
      </header>
      <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
