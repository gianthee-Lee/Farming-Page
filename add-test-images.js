const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const testImages = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Glutinous_corn.jpg/500px-Glutinous_corn.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Plums_hanging.jpg/500px-Plums_hanging.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Rosa_Precious_platinum.jpg/500px-Rosa_Precious_platinum.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Korean_melon-Chamoe-01.jpg/500px-Korean_melon-Chamoe-01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Insalata_lollo_bionda.jpg/500px-Insalata_lollo_bionda.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/CDC_cuke2.jpg"
];

async function main() {
  await prisma.siteInfo.update({
    where: { id: 1 },
    data: {
      cabinImages: JSON.stringify(testImages)
    }
  });
  console.log("Successfully updated 6 test images.");
}

main().catch(console.error).finally(() => process.exit(0));
