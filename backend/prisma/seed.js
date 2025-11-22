const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@stockmaster.com' },
    update: {},
    create: {
      email: 'admin@stockmaster.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@stockmaster.com' },
    update: {},
    create: {
      email: 'manager@stockmaster.com',
      password: hashedPassword,
      firstName: 'Manager',
      lastName: 'User',
      role: 'MANAGER',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@stockmaster.com' },
    update: {},
    create: {
      email: 'staff@stockmaster.com',
      password: hashedPassword,
      firstName: 'Staff',
      lastName: 'User',
      role: 'STAFF',
    },
  });

  console.log('✅ Users created\n');

  // Create Locations
  console.log('Creating locations...');
  const mainWarehouse = await prisma.location.upsert({
    where: { name: 'Main Warehouse' },
    update: {},
    create: {
      name: 'Main Warehouse',
      type: 'WAREHOUSE',
      description: 'Primary storage facility',
    },
  });

  const rackA = await prisma.location.upsert({
    where: { name: 'Rack A' },
    update: {},
    create: {
      name: 'Rack A',
      type: 'RACK',
      description: 'Electronics section',
    },
  });

  const rackB = await prisma.location.upsert({
    where: { name: 'Rack B' },
    update: {},
    create: {
      name: 'Rack B',
      type: 'RACK',
      description: 'Office supplies section',
    },
  });

  const supplier = await prisma.location.upsert({
    where: { name: 'Supplier Location' },
    update: {},
    create: {
      name: 'Supplier Location',
      type: 'SUPPLIER',
      description: 'Virtual location for incoming stock',
    },
  });

  console.log('✅ Locations created\n');

  // Create Products
  console.log('Creating products...');
  const laptop = await prisma.product.upsert({
    where: { skuCode: 'LAPTOP-001' },
    update: {},
    create: {
      name: 'Dell Laptop XPS 15',
      skuCode: 'LAPTOP-001',
      description: 'High-performance laptop with Intel i7',
      category: 'Electronics',
      uom: 'pcs',
      reorderLevel: 5,
    },
  });

  const mouse = await prisma.product.upsert({
    where: { skuCode: 'MOUSE-001' },
    update: {},
    create: {
      name: 'Wireless Mouse',
      skuCode: 'MOUSE-001',
      description: 'Ergonomic wireless mouse',
      category: 'Electronics',
      uom: 'pcs',
      reorderLevel: 20,
    },
  });

  const keyboard = await prisma.product.upsert({
    where: { skuCode: 'KEYBOARD-001' },
    update: {},
    create: {
      name: 'Mechanical Keyboard',
      skuCode: 'KEYBOARD-001',
      description: 'RGB mechanical gaming keyboard',
      category: 'Electronics',
      uom: 'pcs',
      reorderLevel: 10,
    },
  });

  const notebook = await prisma.product.upsert({
    where: { skuCode: 'NOTEBOOK-001' },
    update: {},
    create: {
      name: 'Office Notebook A4',
      skuCode: 'NOTEBOOK-001',
      description: 'Ruled notebook 200 pages',
      category: 'Office Supplies',
      uom: 'pcs',
      reorderLevel: 50,
    },
  });

  const pen = await prisma.product.upsert({
    where: { skuCode: 'PEN-001' },
    update: {},
    create: {
      name: 'Ballpoint Pen Blue',
      skuCode: 'PEN-001',
      description: 'Blue ink ballpoint pen',
      category: 'Office Supplies',
      uom: 'pcs',
      reorderLevel: 100,
    },
  });

  console.log('✅ Products created\n');

  // Create some initial stock via validated receipts
  console.log('Creating initial stock...');

  // Receipt 1 - Laptops
  const receipt1 = await prisma.stockLedger.create({
    data: {
      productId: laptop.id,
      destinationLocationId: rackA.id,
      quantity: 10,
      documentType: 'RECEIPT',
      documentNumber: 'PO-2024-001',
      status: 'VALIDATED',
      validatedAt: new Date(),
      createdBy: manager.id,
      notes: 'Initial stock of laptops',
    },
  });

  await prisma.stockLevel.upsert({
    where: {
      productId_locationId: {
        productId: laptop.id,
        locationId: rackA.id,
      },
    },
    update: {
      quantity: { increment: 10 },
    },
    create: {
      productId: laptop.id,
      locationId: rackA.id,
      quantity: 10,
    },
  });

  // Receipt 2 - Mice
  await prisma.stockLedger.create({
    data: {
      productId: mouse.id,
      destinationLocationId: rackA.id,
      quantity: 50,
      documentType: 'RECEIPT',
      documentNumber: 'PO-2024-002',
      status: 'VALIDATED',
      validatedAt: new Date(),
      createdBy: manager.id,
      notes: 'Initial stock of wireless mice',
    },
  });

  await prisma.stockLevel.upsert({
    where: {
      productId_locationId: {
        productId: mouse.id,
        locationId: rackA.id,
      },
    },
    update: {
      quantity: { increment: 50 },
    },
    create: {
      productId: mouse.id,
      locationId: rackA.id,
      quantity: 50,
    },
  });

  // Receipt 3 - Keyboards
  await prisma.stockLedger.create({
    data: {
      productId: keyboard.id,
      destinationLocationId: rackA.id,
      quantity: 25,
      documentType: 'RECEIPT',
      documentNumber: 'PO-2024-003',
      status: 'VALIDATED',
      validatedAt: new Date(),
      createdBy: manager.id,
      notes: 'Initial stock of keyboards',
    },
  });

  await prisma.stockLevel.upsert({
    where: {
      productId_locationId: {
        productId: keyboard.id,
        locationId: rackA.id,
      },
    },
    update: {
      quantity: { increment: 25 },
    },
    create: {
      productId: keyboard.id,
      locationId: rackA.id,
      quantity: 25,
    },
  });

  // Receipt 4 - Notebooks
  await prisma.stockLedger.create({
    data: {
      productId: notebook.id,
      destinationLocationId: rackB.id,
      quantity: 200,
      documentType: 'RECEIPT',
      documentNumber: 'PO-2024-004',
      status: 'VALIDATED',
      validatedAt: new Date(),
      createdBy: manager.id,
      notes: 'Initial stock of notebooks',
    },
  });

  await prisma.stockLevel.upsert({
    where: {
      productId_locationId: {
        productId: notebook.id,
        locationId: rackB.id,
      },
    },
    update: {
      quantity: { increment: 200 },
    },
    create: {
      productId: notebook.id,
      locationId: rackB.id,
      quantity: 200,
    },
  });

  // Receipt 5 - Pens (below reorder level to test alerts)
  await prisma.stockLedger.create({
    data: {
      productId: pen.id,
      destinationLocationId: rackB.id,
      quantity: 75,
      documentType: 'RECEIPT',
      documentNumber: 'PO-2024-005',
      status: 'VALIDATED',
      validatedAt: new Date(),
      createdBy: manager.id,
      notes: 'Initial stock of pens',
    },
  });

  await prisma.stockLevel.upsert({
    where: {
      productId_locationId: {
        productId: pen.id,
        locationId: rackB.id,
      },
    },
    update: {
      quantity: { increment: 75 },
    },
    create: {
      productId: pen.id,
      locationId: rackB.id,
      quantity: 75,
    },
  });

  // Create a pending receipt (DRAFT)
  await prisma.stockLedger.create({
    data: {
      productId: laptop.id,
      destinationLocationId: mainWarehouse.id,
      quantity: 5,
      documentType: 'RECEIPT',
      documentNumber: 'PO-2024-006',
      status: 'DRAFT',
      createdBy: staff.id,
      notes: 'Pending receipt - not yet validated',
    },
  });

  console.log('✅ Initial stock created\n');

  console.log('🎉 Seeding completed successfully!\n');
  console.log('📝 Test Credentials:');
  console.log('   Admin:   admin@stockmaster.com   / password123');
  console.log('   Manager: manager@stockmaster.com / password123');
  console.log('   Staff:   staff@stockmaster.com   / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

