const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with enhanced schema...\n');

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

  // Create Business Partners (NEW)
  console.log('Creating business partners...');
  
  const techSupplier = await prisma.businessPartner.create({
    data: {
      name: 'TechVendor Inc.',
      code: 'SUP-001',
      type: 'SUPPLIER',
      contactPerson: 'John Smith',
      email: 'john@techvendor.com',
      phone: '+1-555-0100',
      address: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA',
      postalCode: '94102',
      taxId: 'US123456789',
      paymentTerms: 'Net 30',
      notes: 'Primary electronics supplier',
    },
  });

  const officeSupplier = await prisma.businessPartner.create({
    data: {
      name: 'Office Supplies Co.',
      code: 'SUP-002',
      type: 'SUPPLIER',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@officesupplies.com',
      phone: '+1-555-0200',
      address: '456 Office Boulevard',
      city: 'New York',
      country: 'USA',
      postalCode: '10001',
      taxId: 'US987654321',
      paymentTerms: 'Net 15',
      notes: 'Office supplies and stationery',
    },
  });

  const customer1 = await prisma.businessPartner.create({
    data: {
      name: 'Acme Corporation',
      code: 'CUST-001',
      type: 'CUSTOMER',
      contactPerson: 'Mike Wilson',
      email: 'mike@acme.com',
      phone: '+1-555-0300',
      address: '789 Business Ave',
      city: 'Los Angeles',
      country: 'USA',
      postalCode: '90001',
      taxId: 'US111222333',
      paymentTerms: 'Net 45',
      creditLimit: 50000.00,
      notes: 'Enterprise customer - bulk orders',
    },
  });

  const customer2 = await prisma.businessPartner.create({
    data: {
      name: 'StartUp LLC',
      code: 'CUST-002',
      type: 'CUSTOMER',
      contactPerson: 'Lisa Brown',
      email: 'lisa@startup.com',
      phone: '+1-555-0400',
      address: '321 Innovation Drive',
      city: 'Austin',
      country: 'USA',
      postalCode: '73301',
      taxId: 'US444555666',
      paymentTerms: 'Net 30',
      creditLimit: 25000.00,
      notes: 'Growing customer - frequent orders',
    },
  });

  console.log('✅ Business partners created\n');

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

  const customer = await prisma.location.upsert({
    where: { name: 'Customer Location' },
    update: {},
    create: {
      name: 'Customer Location',
      type: 'CUSTOMER',
      description: 'Virtual location for outgoing stock',
    },
  });

  console.log('✅ Locations created\n');

  // Create Products with NEW fields
  console.log('Creating products with enhanced details...');
  
  const laptop = await prisma.product.upsert({
    where: { skuCode: 'LAPTOP-001' },
    update: {},
    create: {
      name: 'Dell Laptop XPS 15',
      skuCode: 'LAPTOP-001',
      barcode: '7501234567890',
      description: 'High-performance laptop with Intel i7',
      category: 'Electronics',
      brand: 'Dell',
      uom: 'pcs',
      unitCost: 1200.00,
      sellingPrice: 1599.00,
      currency: 'USD',
      reorderLevel: 5,
      maxStockLevel: 50,
      leadTimeDays: 7,
      weight: 4.5,
      dimensions: '35.7 x 23.5 x 1.8 cm',
    },
  });

  const mouse = await prisma.product.upsert({
    where: { skuCode: 'MOUSE-001' },
    update: {},
    create: {
      name: 'Wireless Mouse',
      skuCode: 'MOUSE-001',
      barcode: '7501234567891',
      description: 'Ergonomic wireless mouse',
      category: 'Electronics',
      brand: 'Logitech',
      uom: 'pcs',
      unitCost: 25.00,
      sellingPrice: 39.99,
      currency: 'USD',
      reorderLevel: 20,
      maxStockLevel: 200,
      leadTimeDays: 3,
      weight: 0.1,
      dimensions: '12 x 6 x 4 cm',
    },
  });

  const keyboard = await prisma.product.upsert({
    where: { skuCode: 'KEYBOARD-001' },
    update: {},
    create: {
      name: 'Mechanical Keyboard',
      skuCode: 'KEYBOARD-001',
      barcode: '7501234567892',
      description: 'RGB mechanical gaming keyboard',
      category: 'Electronics',
      brand: 'Corsair',
      uom: 'pcs',
      unitCost: 75.00,
      sellingPrice: 129.99,
      currency: 'USD',
      reorderLevel: 10,
      maxStockLevel: 100,
      leadTimeDays: 5,
      weight: 1.2,
      dimensions: '44 x 15 x 4 cm',
    },
  });

  const notebook = await prisma.product.upsert({
    where: { skuCode: 'NOTEBOOK-001' },
    update: {},
    create: {
      name: 'Office Notebook A4',
      skuCode: 'NOTEBOOK-001',
      barcode: '7501234567893',
      description: 'Ruled notebook 200 pages',
      category: 'Office Supplies',
      brand: 'Moleskine',
      uom: 'pcs',
      unitCost: 3.50,
      sellingPrice: 6.99,
      currency: 'USD',
      reorderLevel: 50,
      maxStockLevel: 500,
      leadTimeDays: 2,
      weight: 0.3,
      dimensions: '21 x 29.7 x 1 cm',
    },
  });

  const pen = await prisma.product.upsert({
    where: { skuCode: 'PEN-001' },
    update: {},
    create: {
      name: 'Ballpoint Pen Blue',
      skuCode: 'PEN-001',
      barcode: '7501234567894',
      description: 'Blue ink ballpoint pen',
      category: 'Office Supplies',
      brand: 'Bic',
      uom: 'pcs',
      unitCost: 0.50,
      sellingPrice: 1.25,
      currency: 'USD',
      reorderLevel: 100,
      maxStockLevel: 1000,
      leadTimeDays: 1,
      weight: 0.01,
      dimensions: '14 x 1 x 1 cm',
    },
  });

  console.log('✅ Products created\n');

  // Create initial stock via validated receipts with NEW fields
  console.log('Creating initial stock with enhanced data...');

  // Receipt 1 - Laptops
  await prisma.stockLedger.create({
    data: {
      productId: laptop.id,
      destinationLocationId: rackA.id,
      quantity: 10,
      documentType: 'RECEIPT',
      documentNumber: 'PO-2024-001',
      status: 'VALIDATED',
      contactId: techSupplier.id,
      contactName: techSupplier.name,
      scheduledDate: new Date('2024-11-15'),
      completedDate: new Date('2024-11-16'),
      unitCost: 1200.00,
      totalValue: 12000.00,
      priority: 'NORMAL',
      validatedAt: new Date(),
      createdBy: manager.id,
      validatedBy: manager.id,
      notes: 'Initial stock of laptops from TechVendor',
    },
  });

  await prisma.stockLevel.create({
    data: {
      productId: laptop.id,
      locationId: rackA.id,
      onHandQuantity: 10,
      reservedQuantity: 0,
      availableQuantity: 10,
      lastCountDate: new Date(),
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
      contactId: techSupplier.id,
      contactName: techSupplier.name,
      scheduledDate: new Date('2024-11-18'),
      completedDate: new Date('2024-11-18'),
      unitCost: 25.00,
      totalValue: 1250.00,
      priority: 'NORMAL',
      validatedAt: new Date(),
      createdBy: manager.id,
      validatedBy: manager.id,
      notes: 'Initial stock of wireless mice',
    },
  });

  await prisma.stockLevel.create({
    data: {
      productId: mouse.id,
      locationId: rackA.id,
      onHandQuantity: 50,
      reservedQuantity: 5,
      availableQuantity: 45,
      lastCountDate: new Date(),
    },
  });

  // Create a reservation for the mice
  await prisma.stockReservation.create({
    data: {
      productId: mouse.id,
      locationId: rackA.id,
      quantity: 5,
      reservationType: 'SALES_ORDER',
      referenceNumber: 'SO-2024-001',
      reservedFor: customer1.name,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'ACTIVE',
      createdBy: staff.id,
      notes: 'Reserved for Acme Corporation order',
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
      contactId: techSupplier.id,
      contactName: techSupplier.name,
      scheduledDate: new Date('2024-11-20'),
      completedDate: new Date('2024-11-20'),
      unitCost: 75.00,
      totalValue: 1875.00,
      priority: 'NORMAL',
      validatedAt: new Date(),
      createdBy: manager.id,
      validatedBy: manager.id,
      notes: 'Initial stock of keyboards',
    },
  });

  await prisma.stockLevel.create({
    data: {
      productId: keyboard.id,
      locationId: rackA.id,
      onHandQuantity: 25,
      reservedQuantity: 0,
      availableQuantity: 25,
      lastCountDate: new Date(),
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
      contactId: officeSupplier.id,
      contactName: officeSupplier.name,
      scheduledDate: new Date('2024-11-10'),
      completedDate: new Date('2024-11-10'),
      unitCost: 3.50,
      totalValue: 700.00,
      priority: 'LOW',
      validatedAt: new Date(),
      createdBy: manager.id,
      validatedBy: manager.id,
      notes: 'Initial stock of notebooks',
    },
  });

  await prisma.stockLevel.create({
    data: {
      productId: notebook.id,
      locationId: rackB.id,
      onHandQuantity: 200,
      reservedQuantity: 0,
      availableQuantity: 200,
      lastCountDate: new Date(),
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
      contactId: officeSupplier.id,
      contactName: officeSupplier.name,
      scheduledDate: new Date('2024-11-12'),
      completedDate: new Date('2024-11-12'),
      unitCost: 0.50,
      totalValue: 37.50,
      priority: 'LOW',
      validatedAt: new Date(),
      createdBy: manager.id,
      validatedBy: manager.id,
      notes: 'Initial stock of pens',
    },
  });

  await prisma.stockLevel.create({
    data: {
      productId: pen.id,
      locationId: rackB.id,
      onHandQuantity: 75,
      reservedQuantity: 0,
      availableQuantity: 75,
      lastCountDate: new Date(),
    },
  });

  // Create pending receipts (DRAFT status)
  await prisma.stockLedger.create({
    data: {
      productId: laptop.id,
      destinationLocationId: mainWarehouse.id,
      quantity: 5,
      documentType: 'RECEIPT',
      documentNumber: 'PO-2024-006',
      status: 'DRAFT',
      contactId: techSupplier.id,
      contactName: techSupplier.name,
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      unitCost: 1200.00,
      totalValue: 6000.00,
      priority: 'NORMAL',
      createdBy: staff.id,
      notes: 'Pending receipt - awaiting arrival',
    },
  });

  // Create a pending delivery (DRAFT status)
  await prisma.stockLedger.create({
    data: {
      productId: laptop.id,
      sourceLocationId: rackA.id,
      quantity: 3,
      documentType: 'DELIVERY',
      documentNumber: 'DO-2024-001',
      status: 'DRAFT',
      contactId: customer1.id,
      contactName: customer1.name,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      unitCost: 1200.00,
      totalValue: 3600.00,
      priority: 'HIGH',
      trackingNumber: 'TRK-20241122-001',
      createdBy: staff.id,
      notes: 'Urgent delivery to Acme Corporation',
    },
  });

  // Create an overdue delivery (past scheduled date, still DRAFT)
  await prisma.stockLedger.create({
    data: {
      productId: keyboard.id,
      sourceLocationId: rackA.id,
      quantity: 5,
      documentType: 'DELIVERY',
      documentNumber: 'DO-2024-002',
      status: 'DRAFT',
      contactId: customer2.id,
      contactName: customer2.name,
      scheduledDate: new Date('2024-11-18'), // Past date
      unitCost: 75.00,
      totalValue: 375.00,
      priority: 'URGENT',
      trackingNumber: 'TRK-20241118-002',
      createdBy: staff.id,
      notes: 'OVERDUE - needs immediate attention',
    },
  });

  // Create a validated (completed) delivery
  await prisma.stockLedger.create({
    data: {
      productId: mouse.id,
      sourceLocationId: rackA.id,
      quantity: 10,
      documentType: 'DELIVERY',
      documentNumber: 'DO-2024-003',
      status: 'VALIDATED',
      contactId: customer1.id,
      contactName: customer1.name,
      scheduledDate: new Date('2024-11-19'),
      completedDate: new Date('2024-11-19'),
      unitCost: 25.00,
      totalValue: 250.00,
      priority: 'NORMAL',
      trackingNumber: 'TRK-20241119-003',
      validatedAt: new Date('2024-11-19'),
      validatedBy: manager.id,
      createdBy: staff.id,
      notes: 'Successfully delivered to Acme Corporation',
    },
  });

  console.log('✅ Initial stock and transactions created\n');

  console.log('🎉 Enhanced seeding completed successfully!\n');
  console.log('📊 Database Summary:');
  console.log('   - 3 Users (Admin, Manager, Staff)');
  console.log('   - 4 Business Partners (2 Suppliers, 2 Customers)');
  console.log('   - 5 Locations');
  console.log('   - 5 Products (with costs, barcodes, dimensions)');
  console.log('   - 5 Stock Levels (with on-hand, reserved, available)');
  console.log('   - 10 Stock Ledger Entries (Receipts & Deliveries)');
  console.log('   - 1 Stock Reservation\n');
  console.log('📝 Test Credentials:');
  console.log('   Admin:   admin@stockmaster.com   / password123');
  console.log('   Manager: manager@stockmaster.com / password123');
  console.log('   Staff:   staff@stockmaster.com   / password123\n');
  console.log('💼 Business Partners:');
  console.log('   Suppliers: TechVendor Inc. (SUP-001), Office Supplies Co. (SUP-002)');
  console.log('   Customers: Acme Corporation (CUST-001), StartUp LLC (CUST-002)\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
