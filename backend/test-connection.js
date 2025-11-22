const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Connection successful!');
    
    // Try to query databases
    const result = await prisma.$queryRaw`SELECT current_database(), current_user;`;
    console.log('📊 Connected as:', result);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
