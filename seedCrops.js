const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleCrops = [
  { name: '유기농 상추', description: '매일 아침 수확하는 신선한 상추', price: '2,000원' },
  { name: '달콤한 토마토', description: '햇살 듬뿍 받고 자란 찰토마토', price: '5,000원' },
  { name: '아삭한 오이', description: '수분 가득 시원한 오이', price: '3,000원' },
  { name: '매콤 청양고추', description: '요리의 풍미를 살리는 매운 고추', price: '2,500원' },
  { name: '신선한 깻잎', description: '향긋하고 신선한 깻잎', price: '1,500원' },
  { name: '달달한 고구마', description: '꿀이 뚝뚝 떨어지는 호박고구마', price: '10,000원' },
  { name: '포슬포슬 감자', description: '강원도 수미감자', price: '8,000원' },
  { name: '영양만점 가지', description: '건강에 좋은 안토시아닌 가득', price: '3,500원' },
  { name: '신선 애호박', description: '찌개에 쏙 넣기 좋은 애호박', price: '2,000원' },
  { name: '달콤한 단호박', description: '쪄먹기 좋은 미니 단호박', price: '4,000원' },
  { name: '시원한 무', description: '가을 무처럼 달고 시원한 무', price: '3,000원' },
  { name: '아삭 양배추', description: '위 건강에 좋은 신선 양배추', price: '4,500원' },
  { name: '알싸한 마늘', description: '국내산 햇마늘', price: '12,000원' },
  { name: '달큰한 양파', description: '단맛이 일품인 양파', price: '5,500원' },
  { name: '영양부추', description: '입맛 돋우는 신선한 부추', price: '2,800원' },
  { name: '향긋한 미나리', description: '삼겹살과 찰떡궁합 미나리', price: '3,500원' },
  { name: '싱싱한 대파', description: '모든 요리의 필수품 대파', price: '2,500원' },
  { name: '빨간 파프리카', description: '비타민 가득 샐러드용 파프리카', price: '4,000원' },
  { name: '노란 파프리카', description: '달콤한 노란 파프리카', price: '4,000원' },
  { name: '찰옥수수', description: '쫀득쫀득 맛있는 찰옥수수', price: '6,000원' }
];

async function main() {
  console.log('기존 농작물 데이터를 삭제 중...');
  await prisma.crop.deleteMany();
  
  console.log('20개의 농작물 샘플을 추가 중...');
  for (const crop of sampleCrops) {
    await prisma.crop.create({
      data: {
        ...crop,
        isAvailable: true
      }
    });
  }
  console.log('완료되었습니다!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
