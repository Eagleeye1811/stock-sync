#!/bin/bash

echo "Testing different connection strings..."
echo ""

# Test 1: postgres user, no password
echo "Test 1: postgres user (no password)"
DATABASE_URL="postgresql://postgres@localhost:5432/stockmaster_db?schema=public" \
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    await prisma.\$connect();
    console.log('✅ SUCCESS with postgres (no password)');
    await prisma.\$disconnect();
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message.split('\\n')[0]);
    return false;
  }
}
test();
" 2>&1 | grep -E "(SUCCESS|Failed)"

# Test 2: postgres user with postgres password
echo ""
echo "Test 2: postgres user (password: postgres)"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stockmaster_db?schema=public" \
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    await prisma.\$connect();
    console.log('✅ SUCCESS with postgres:postgres');
    await prisma.\$disconnect();
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message.split('\\n')[0]);
    return false;
  }
}
test();
" 2>&1 | grep -E "(SUCCESS|Failed)"

# Test 3: apple user (your system user)
echo ""
echo "Test 3: apple user (no password)"
DATABASE_URL="postgresql://apple@localhost:5432/stockmaster_db?schema=public" \
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    await prisma.\$connect();
    console.log('✅ SUCCESS with apple user');
    await prisma.\$disconnect();
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message.split('\\n')[0]);
    return false;
  }
}
test();
" 2>&1 | grep -E "(SUCCESS|Failed)"

