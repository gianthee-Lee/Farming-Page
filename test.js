const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.crop.findMany({select:{name:true, image:true}}).then(res => {
  console.log(res);
  process.exit(0);
});
