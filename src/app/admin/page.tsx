'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type SiteInfo = {
  farmName: string;
  farmIntro: string;
  farmImage: string | null;
  heroNotice: string;
  cartName: string;
  cabinIntro: string;
  cabinImage: string | null;
  cabinImages: string[];
  phoneNumber: string;
  kakaoLink: string;
  address: string;
};

type Crop = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string | null;
  isAvailable: boolean;
};

export default function AdminDashboard() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'site' | 'crops' | 'reservations'>('site');
  const [savingAll, setSavingAll] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [siteRes, cropsRes, resRes] = await Promise.all([
      fetch('/api/site'),
      fetch('/api/crops'),
      fetch('/api/reservations'),
    ]);
    const siteData = await siteRes.json();
    const cropsData = await cropsRes.json();
    const resData = await resRes.json();
    setSiteInfo(siteData.data);
    setCrops(cropsData.data);
    if (resData.success) {
      setReservations(resData.data);
    }
    setLoading(false);
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const handleSiteInfoImageChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'farmImage' | 'cabinImage') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const url = await handleUploadImage(e.target.files[0]);
    setSiteInfo({ ...siteInfo!, [field]: url });
  };

  const saveSiteInfo = async () => {
    await fetch('/api/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteInfo),
    });
    alert('저장되었습니다.');
  };

  const saveAllCrops = async () => {
    setSavingAll(true);
    try {
      await Promise.all(crops.map(crop => 
        fetch(`/api/crops/${crop.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: crop.name,
            description: crop.description,
            price: crop.price,
            isAvailable: crop.isAvailable,
          }),
        })
      ));
      alert('모든 작물 정보가 저장되었습니다.');
      fetchData();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSavingAll(false);
    }
  };

  const addCrop = async () => {
    await fetch('/api/crops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '새 작물', description: '설명', price: '0원' }),
    });
    fetchData();
  };

  const deleteCrop = async (id: number) => {
    if (confirm('정말로 이 농작물을 삭제하시겠습니까?')) {
      await fetch(`/api/crops/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  if (loading || !siteInfo) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${activeTab === 'site' ? 'btn-primary' : ''}`} 
          style={{ background: activeTab !== 'site' ? '#fff' : '', color: activeTab !== 'site' ? '#333' : '', border: '1px solid #ccc' }}
          onClick={() => setActiveTab('site')}
        >
          기본 정보 관리
        </button>
        <button 
          className={`btn ${activeTab === 'crops' ? 'btn-primary' : ''}`} 
          style={{ background: activeTab !== 'crops' ? '#fff' : '', color: activeTab !== 'crops' ? '#333' : '', border: '1px solid #ccc' }}
          onClick={() => setActiveTab('crops')}
        >
          농작물 관리
        </button>
        <button 
          className={`btn ${activeTab === 'reservations' ? 'btn-primary' : ''}`} 
          style={{ background: activeTab !== 'reservations' ? '#fff' : '', color: activeTab !== 'reservations' ? '#333' : '', border: '1px solid #ccc' }}
          onClick={() => setActiveTab('reservations')}
        >
          예약 관리
        </button>
      </div>

      {activeTab === 'site' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>사이트 기본 정보</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>농장 이름</label>
              <input type="text" value={siteInfo.farmName} onChange={(e) => setSiteInfo({ ...siteInfo, farmName: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>농장 소개글</label>
              <textarea value={siteInfo.farmIntro} onChange={(e) => setSiteInfo({ ...siteInfo, farmIntro: e.target.value })} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>농장 배경 사진</label>
              {siteInfo.farmImage && <img src={siteInfo.farmImage} alt="Farm" style={{ height: '100px', objectFit: 'cover', marginBottom: '0.5rem', borderRadius: '0.25rem' }} />}
              <input type="file" accept="image/*" onChange={(e) => handleSiteInfoImageChange(e, 'farmImage')} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>메인 페이지 운영시간/공지 (농막 구경하기 버튼 위)</label>
              <textarea value={siteInfo.heroNotice} onChange={(e) => setSiteInfo({ ...siteInfo, heroNotice: e.target.value })} rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>쇼핑 카트(장바구니) 이름</label>
              <input type="text" value={siteInfo.cartName} onChange={(e) => setSiteInfo({ ...siteInfo, cartName: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
            </div>
            <hr style={{ border: '0', borderTop: '1px solid #eee' }} />
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>농막 소개글</label>
              <textarea value={siteInfo.cabinIntro} onChange={(e) => setSiteInfo({ ...siteInfo, cabinIntro: e.target.value })} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>농막 사진 (여러 장 추가 가능)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => document.getElementById('cabin-scroll-container')?.scrollBy({ left: -200, behavior: 'smooth' })} style={{ padding: '0.25rem 0.5rem', background: '#e5e7eb', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>◀</button>
                  <button onClick={() => document.getElementById('cabin-scroll-container')?.scrollBy({ left: 200, behavior: 'smooth' })} style={{ padding: '0.25rem 0.5rem', background: '#e5e7eb', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>▶</button>
                </div>
              </div>
              
              <div id="cabin-scroll-container" style={{ display: 'flex', gap: '1rem', overflowX: 'hidden', paddingBottom: '1rem', whiteSpace: 'nowrap' }}>
                {siteInfo.cabinImages && siteInfo.cabinImages.map((img, idx) => (
                  <div key={idx} style={{ flex: '0 0 calc(25% - 0.75rem)', minWidth: '150px', position: 'relative' }}>
                    <img src={img} alt={`Cabin ${idx}`} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                    <button 
                      onClick={() => setSiteInfo({ ...siteInfo, cabinImages: siteInfo.cabinImages.filter((_, i) => i !== idx) })}
                      style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      X
                    </button>
                  </div>
                ))}
                {(!siteInfo.cabinImages || siteInfo.cabinImages.length === 0) && (
                  <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>등록된 사진이 없습니다.</div>
                )}
              </div>
              
              <input type="file" accept="image/*" multiple onChange={async (e) => {
                if (!e.target.files) return;
                const newImages = [...(siteInfo.cabinImages || [])];
                for (let i = 0; i < e.target.files.length; i++) {
                  const file = e.target.files[i];
                  const formData = new FormData();
                  formData.append('file', file);
                  const res = await fetch('/api/upload', { method: 'POST', body: formData });
                  const data = await res.json();
                  if (data.url) newImages.push(data.url);
                }
                setSiteInfo({ ...siteInfo, cabinImages: newImages });
              }} style={{ marginTop: '0.5rem' }} />
            </div>
            <hr style={{ border: '0', borderTop: '1px solid #eee' }} />
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>전화번호</label>
              <input type="text" value={siteInfo.phoneNumber} onChange={(e) => setSiteInfo({ ...siteInfo, phoneNumber: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>카카오톡 오픈채팅/채널 링크</label>
              <input type="text" value={siteInfo.kakaoLink} onChange={(e) => setSiteInfo({ ...siteInfo, kakaoLink: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>농장 주소</label>
              <input type="text" value={siteInfo.address} onChange={(e) => setSiteInfo({ ...siteInfo, address: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #ccc' }} />
            </div>

            <button onClick={saveSiteInfo} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>저장하기</button>
          </div>
        </div>
      )}

      {activeTab === 'crops' && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: '#f3f4f6',
            padding: '1rem 0',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>농작물 목록</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-primary"
                onClick={saveAllCrops}
                disabled={savingAll}
                style={{ background: '#059669', borderColor: '#059669' }}
              >
                {savingAll ? '저장 중...' : '💾 일괄 저장'}
              </button>
              <button 
                className="btn btn-primary"
                onClick={async () => {
                  const name = prompt('농작물 이름을 입력하세요 (예: 유기농 감자)');
                  if (name) {
                    await fetch('/api/crops', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, description: '설명을 입력하세요', price: '가격 미정', autoFetchImage: false }),
                    });
                    fetchData();
                  }
                }}
              >
                + 새 작물 추가
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {crops.map((crop, index) => (
              <CropEditor 
                key={crop.id} 
                crop={crop} 
                onChange={(updatedCrop) => {
                  const newCrops = [...crops];
                  newCrops[index] = updatedCrop;
                  setCrops(newCrops);
                }}
                onUpload={handleUploadImage} 
                onDelete={() => deleteCrop(crop.id)} 
              />
            ))}
            {crops.length === 0 && <p style={{ color: '#666' }}>등록된 농작물이 없습니다.</p>}
          </div>
        </div>
      )}
      {activeTab === 'reservations' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>예약 관리</h2>
          
          {reservations.length === 0 ? (
            <p style={{ color: '#666' }}>아직 접수된 예약이 없습니다.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem' }}>예약 일시</th>
                    <th style={{ padding: '1rem' }}>예약자명</th>
                    <th style={{ padding: '1rem' }}>연락처</th>
                    <th style={{ padding: '1rem' }}>예약 내역</th>
                    <th style={{ padding: '1rem' }}>상태</th>
                    <th style={{ padding: '1rem' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(res => (
                    <tr key={res.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{new Date(res.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{res.customerName}</td>
                      <td style={{ padding: '1rem' }}>{res.phoneNumber}</td>
                      <td style={{ padding: '1rem' }}>
                        <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                          {res.items.map((item: any) => (
                            <li key={item.id}>{item.crop.name} - {item.quantity}개</li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.875rem',
                          background: res.status === '대기' ? '#fef3c7' : res.status === '확인' ? '#d1fae5' : res.status === '완료' ? '#e0f2fe' : '#fee2e2',
                          color: res.status === '대기' ? '#92400e' : res.status === '확인' ? '#065f46' : res.status === '완료' ? '#0369a1' : '#991b1b'
                        }}>
                          {res.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <select 
                          value={res.status}
                          onChange={async (e) => {
                            await fetch(`/api/reservations/${res.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: e.target.value })
                            });
                            fetchData();
                          }}
                          style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ccc' }}
                        >
                          <option value="대기">대기</option>
                          <option value="확인">확인</option>
                          <option value="완료">완료</option>
                          <option value="취소">취소</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CropEditor({ crop, onChange, onUpload, onDelete }: { crop: Crop, onChange: (c: Crop) => void, onUpload: (f: File) => Promise<string>, onDelete: () => void }) {
  const [fetchingImage, setFetchingImage] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await onUpload(e.target.files[0]);
      onChange({ ...crop, image: url });
    }
  };

  const handleAutoFetchImage = async () => {
    if (!crop.name) {
      alert('작물 이름을 먼저 입력해주세요.');
      return;
    }
    setFetchingImage(true);
    try {
      const res = await fetch(`/api/images/auto?name=${encodeURIComponent(crop.name)}`);
      const result = await res.json();
      if (result.success && result.url) {
        onChange({ ...crop, image: result.url });
      } else {
        alert('자동 사진을 찾을 수 없습니다.');
      }
    } catch (e) {
      alert('사진 검색 중 오류가 발생했습니다.');
    }
    setFetchingImage(false);
  };

  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div style={{ width: '150px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {crop.image ? (
           <img src={crop.image} alt={crop.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.25rem' }} />
        ) : (
          <div style={{ width: '100%', height: '150px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.25rem' }}>No Image</div>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '13px', width: '100%' }} />
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', marginTop: '0.25rem' }}>
          <button 
            type="button"
            style={{ 
              padding: '1px 6px', 
              background: '#efefef', 
              color: 'buttontext', 
              border: '1px solid #767676', 
              borderRadius: '2px', 
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'system-ui',
              whiteSpace: 'nowrap'
            }}
            onClick={handleAutoFetchImage}
            disabled={fetchingImage}
          >
            {fetchingImage ? '검색 중...' : '자동 사진 추가'}
          </button>
        </div>
      </div>
      
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label style={{ fontSize: '0.875rem', color: '#666' }}>이름</label>
          <input type="text" value={crop.name} onChange={(e) => onChange({ ...crop, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.875rem', color: '#666' }}>가격</label>
          <input type="text" value={crop.price} onChange={(e) => onChange({ ...crop, price: e.target.value })} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.875rem', color: '#666' }}>설명</label>
          <textarea value={crop.description} onChange={(e) => onChange({ ...crop, description: e.target.value })} rows={2} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem' }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
          <input type="checkbox" checked={crop.isAvailable} onChange={(e) => onChange({ ...crop, isAvailable: e.target.checked })} />
          판매 중 표시
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button onClick={onDelete} className="btn" style={{ background: '#fee2e2', color: '#ef4444', height: '100%' }}>
          삭제
        </button>
      </div>
    </div>
  );
}
