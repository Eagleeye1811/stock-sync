# Enhanced Database Schema Documentation
# StockMaster IMS - Robust Inventory Management System

## 📋 Overview
This document details the enhanced database schema designed to support all frontend pages with comprehensive columns for a robust inventory management system.

---

## 🎯 Page-to-Schema Mapping

### 1️⃣ **Dashboard Page**

**Purpose:** Real-time overview of inventory operations and key metrics

**Data Sources & Columns:**

| Metric | Source Table | Columns Used |
|--------|-------------|--------------|
| **Total Products** | `products` | `COUNT(id) WHERE isActive = true` |
| **Total Stock Value** | `stock_levels` JOIN `products` | `SUM(onHandQuantity * unitCost)` |
| **Low Stock Alerts** | `products` JOIN `stock_levels` | `WHERE onHandQuantity <= reorderLevel` |
| **Pending Receipts** | `stock_ledger` | `WHERE documentType = 'RECEIPT' AND status = 'DRAFT'` |
| **Pending Deliveries** | `stock_ledger` | `WHERE documentType = 'DELIVERY' AND status = 'DRAFT'` |
| **Recent Moves (Last 10)** | `stock_ledger` | `ORDER BY createdAt DESC LIMIT 10` |
| **Reserved Stock Value** | `stock_levels` JOIN `products` | `SUM(reservedQuantity * unitCost)` |
| **Available Stock Value** | `stock_levels` JOIN `products` | `SUM(availableQuantity * unitCost)` |

**Key Features:**
- Summary cards with real-time counts
- Low stock alerts with product details
- Recent activity timeline
- Stock value breakdown (On Hand, Reserved, Available)

---

### 2️⃣ **Stock Page (Product Inventory)**

**Purpose:** View and manage product inventory levels

**Table:** `products` JOIN `stock_levels`

**Columns for Display:**

| Column Display Name | Database Field(s) | Description |
|---------------------|-------------------|-------------|
| **Product** | `products.name`<br>`products.skuCode`<br>`products.barcode` | Product identification with SKU and barcode |
| **Category** | `products.category` | Product category for filtering |
| **On Hand** | `stock_levels.onHandQuantity` | Total physical stock quantity |
| **Reserved** | `stock_levels.reservedQuantity` | Stock allocated/reserved for orders |
| **Free to Use** | `stock_levels.availableQuantity` | Available stock (On Hand - Reserved) |
| **Per Unit Cost** | `products.unitCost` | Purchase/cost price per unit |
| **Selling Price** | `products.sellingPrice` | Selling price per unit |
| **Total Value** | `onHandQuantity * unitCost` | Total inventory value |
| **UOM** | `products.uom` | Unit of measure (pcs, kg, liters) |
| **Reorder Level** | `products.reorderLevel` | Minimum stock threshold |
| **Location** | `locations.name` | Storage location |
| **Last Count** | `stock_levels.lastCountDate` | Last physical inventory date |
| **Status** | `products.isActive` | Active/Inactive status |

**Additional Features:**
- Stock status indicator (In Stock, Low Stock, Out of Stock, Overstocked)
- Filtering by category, location, stock status
- Export to Excel/CSV
- Bulk update capabilities

---

### 3️⃣ **Move History Page**

**Purpose:** Complete audit trail of all stock movements

**Table:** `stock_ledger` with joins

**Columns for Display:**

| Column Display Name | Database Field(s) | Description |
|---------------------|-------------------|-------------|
| **Reference** | `documentNumber` | Document reference (PO#, DO#, etc.) |
| **Date** | `createdAt` | Transaction creation date |
| **Type** | `documentType` | RECEIPT, DELIVERY, INTERNAL_TRANSFER, ADJUSTMENT |
| **Product** | `products.name`<br>`products.skuCode` | Product moved |
| **From** | `sourceLocation.name` | Source location |
| **To** | `destinationLocation.name` | Destination location |
| **Contact** | `contact.name`<br>`contactName` | Supplier/Customer name |
| **Quantity** | `quantity` | Quantity moved |
| **Unit Cost** | `unitCost` | Cost per unit at transaction |
| **Total Value** | `totalValue` | Total transaction value |
| **Status** | `status` | DRAFT, VALIDATED, CANCELLED |
| **Priority** | `priority` | LOW, NORMAL, HIGH, URGENT |
| **Created By** | `user.firstName`<br>`user.lastName` | User who created the move |
| **Validated By** | `validatedBy` | User who validated |
| **Validated At** | `validatedAt` | Validation timestamp |
| **Notes** | `notes` | Additional comments |

**Additional Features:**
- Filter by date range, document type, status
- Search by reference number or product
- Export filtered results
- View transaction details modal

---

### 4️⃣ **Delivery Page (Outgoing Orders)**

**Purpose:** Manage deliveries to customers

**Table:** `stock_ledger` WHERE `documentType = 'DELIVERY'`

**Columns for Display:**

| Column Display Name | Database Field(s) | Description |
|---------------------|-------------------|-------------|
| **Reference** | `documentNumber` | Delivery Order number (DO#) |
| **Customer (Contact)** | `contact.name`<br>`contact.contactPerson`<br>`contact.phone` | Customer details |
| **From** | `sourceLocation.name` | Warehouse/Location shipping from |
| **To** | `contact.address`<br>`contact.city`<br>`contact.country` | Delivery destination |
| **Product** | `products.name`<br>`products.skuCode` | Product being delivered |
| **Quantity** | `quantity` | Delivery quantity |
| **Scheduled Date** | `scheduledDate` | Expected/Planned delivery date |
| **Completed Date** | `completedDate` | Actual delivery completion date |
| **Status** | `status` | DRAFT, VALIDATED, CANCELLED |
| **Priority** | `priority` | Delivery priority level |
| **Tracking Number** | `trackingNumber` | Shipment tracking number |
| **Total Value** | `totalValue` | Delivery order value |
| **Created By** | `user.firstName`<br>`user.lastName` | Order creator |
| **Created At** | `createdAt` | Order creation date |
| **Notes** | `notes` | Special instructions |

**Additional Features:**
- Status badges (Pending, In Transit, Delivered, Cancelled)
- Overdue deliveries highlight (scheduledDate < today AND status != VALIDATED)
- Print delivery note/packing slip
- Update tracking number
- Mark as completed

---

### 5️⃣ **Receipts Page (Incoming Orders)**

**Purpose:** Manage incoming stock from suppliers

**Table:** `stock_ledger` WHERE `documentType = 'RECEIPT'`

**Columns for Display:**

| Column Display Name | Database Field(s) | Description |
|---------------------|-------------------|-------------|
| **Reference** | `documentNumber` | Purchase Order number (PO#) |
| **Supplier (Contact)** | `contact.name`<br>`contact.contactPerson`<br>`contact.phone` | Supplier details |
| **From** | `contact.address`<br>`contact.city` | Supplier location |
| **To** | `destinationLocation.name` | Receiving warehouse/location |
| **Product** | `products.name`<br>`products.skuCode` | Product being received |
| **Quantity** | `quantity` | Receipt quantity |
| **Scheduled Date** | `scheduledDate` | Expected arrival date |
| **Completed Date** | `completedDate` | Actual receipt date |
| **Status** | `status` | DRAFT, VALIDATED, CANCELLED |
| **Priority** | `priority` | Receipt priority |
| **Unit Cost** | `unitCost` | Purchase cost per unit |
| **Total Value** | `totalValue` | Total PO value |
| **Payment Terms** | `contact.paymentTerms` | Supplier payment terms |
| **Created By** | `user.firstName`<br>`user.lastName` | Order creator |
| **Created At** | `createdAt` | Order creation date |
| **Notes** | `notes` | Special instructions |

**Additional Features:**
- Status badges (Pending, Partially Received, Received, Cancelled)
- Overdue receipts highlight (scheduledDate < today AND status != VALIDATED)
- Quality inspection checklist
- Print receiving report
- Update actual costs
- Match to purchase order

---

## 🚀 Additional Columns for Robust Inventory Management

### ✅ **Already Added in Enhanced Schema:**

1. **Cost Tracking:**
   - `products.unitCost` - Per unit purchase cost
   - `products.sellingPrice` - Per unit selling price
   - `products.currency` - Currency code
   - `stock_ledger.unitCost` - Historical cost tracking
   - `stock_ledger.totalValue` - Transaction value

2. **Stock Availability:**
   - `stock_levels.onHandQuantity` - Physical stock
   - `stock_levels.reservedQuantity` - Reserved/allocated
   - `stock_levels.availableQuantity` - Free to use
   - `stock_levels.lastCountDate` - Last physical count

3. **Contact Management:**
   - `business_partners` table with full supplier/customer details
   - Contact person, email, phone, address
   - Tax ID, payment terms, credit limit

4. **Scheduling & Planning:**
   - `stock_ledger.scheduledDate` - Expected delivery/receipt date
   - `stock_ledger.completedDate` - Actual completion
   - `products.leadTimeDays` - Supplier lead time
   - `stock_reservations.expiresAt` - Reservation expiry

5. **Product Details:**
   - `products.barcode` - Barcode/EAN for scanning
   - `products.brand` - Brand information
   - `products.weight` - Weight per unit
   - `products.dimensions` - Physical dimensions
   - `products.maxStockLevel` - Maximum capacity

6. **Priority & Status Tracking:**
   - `stock_ledger.priority` - Transaction priority
   - `stock_ledger.trackingNumber` - Shipment tracking
   - `stock_ledger.validatedBy` - Approval tracking
   - Multiple status enums for granular control

7. **Stock Reservations:**
   - Separate `stock_reservations` table
   - Tracks reserved stock for sales orders, work orders
   - Expiration dates for reservations

---

## 💡 Recommended Additional Enhancements

### **For Advanced Inventory Management:**

1. **Batch/Lot Tracking** (for manufacturing & expiry)
   ```sql
   model ProductBatch {
     id              String   @id @default(uuid())
     productId       String
     batchNumber     String   @unique
     lotNumber       String?
     manufactureDate DateTime?
     expiryDate      DateTime?
     quantity        Float
     locationId      String
     status          BatchStatus // ACTIVE, EXPIRED, RECALLED
   }
   ```

2. **Serial Number Tracking** (for high-value items)
   ```sql
   model SerialNumber {
     id           String   @id @default(uuid())
     productId    String
     serialNumber String   @unique
     status       SerialStatus // IN_STOCK, SOLD, WARRANTY, REPAIR
     locationId   String?
     purchaseDate DateTime?
     warrantyExpiry DateTime?
   }
   ```

3. **Multi-Currency Support** (for international operations)
   - Add exchange rate tracking
   - Currency conversion in reports
   - Base currency configuration

4. **Bin/Zone Location** (for large warehouses)
   ```sql
   model BinLocation {
     id         String @id @default(uuid())
     warehouseId String
     aisle      String
     rack       String
     shelf      String
     bin        String
     capacity   Float?
     currentOccupancy Float @default(0)
   }
   ```

5. **Stock Alerts & Notifications**
   ```sql
   model StockAlert {
     id          String @id @default(uuid())
     productId   String
     alertType   AlertType // LOW_STOCK, OVERSTOCK, EXPIRING, NO_MOVEMENT
     threshold   Float?
     isActive    Boolean @default(true)
     lastTriggered DateTime?
   }
   ```

6. **Audit Log** (complete change tracking)
   ```sql
   model AuditLog {
     id         String @id @default(uuid())
     tableName  String
     recordId   String
     action     Action // CREATE, UPDATE, DELETE
     oldValue   Json?
     newValue   Json?
     changedBy  String
     changedAt  DateTime @default(now())
   }
   ```

7. **Stock Cycle Counting** (physical inventory)
   ```sql
   model CycleCount {
     id            String @id @default(uuid())
     locationId    String
     scheduledDate DateTime
     completedDate DateTime?
     status        CountStatus // SCHEDULED, IN_PROGRESS, COMPLETED
     countedBy     String?
     discrepancies Int @default(0)
   }
   ```

8. **Purchase/Sales Orders** (separate from movements)
   ```sql
   model PurchaseOrder {
     id             String @id @default(uuid())
     poNumber       String @unique
     supplierId     String
     orderDate      DateTime
     expectedDate   DateTime?
     status         POStatus // DRAFT, SENT, CONFIRMED, RECEIVED, CLOSED
     totalAmount    Float
     paidAmount     Float @default(0)
     items          POItem[]
   }
   ```

---

## 📊 Database Statistics & Performance

### **Indexes Added for Fast Queries:**

- `products`: category, skuCode, barcode
- `stock_levels`: productId, locationId
- `stock_ledger`: productId, documentType, status, createdAt, documentNumber, contactId, scheduledDate
- `business_partners`: type, code
- `stock_reservations`: productId, locationId, status

### **Key Relationships:**

- Products ↔ Stock Levels (one-to-many)
- Products ↔ Stock Ledger (one-to-many)
- Locations ↔ Stock Levels (one-to-many)
- Users ↔ Stock Ledger (one-to-many, via createdBy)
- Business Partners ↔ Stock Ledger (one-to-many)
- Products ↔ Stock Reservations (one-to-many)

### **Cascade Deletes Configured:**

- Deleting a Product cascades to its Stock Levels, Ledger, and Reservations
- Deleting a Location cascades to its Stock Levels

---

## 🎨 Frontend Implementation Notes

### **Recommended Component Structure:**

1. **Dashboard Components:**
   - `SummaryCards.jsx` - KPI metrics
   - `LowStockTable.jsx` - Products below reorder level
   - `RecentActivityFeed.jsx` - Latest movements
   - `StockValueChart.jsx` - Visual representation

2. **Stock Page Components:**
   - `StockTable.jsx` - Main inventory grid
   - `StockFilters.jsx` - Category, location, status filters
   - `StockDetails.jsx` - Product detail modal
   - `StockActions.jsx` - Bulk actions toolbar

3. **Move History Components:**
   - `MoveHistoryTable.jsx` - Transaction log
   - `MoveFilters.jsx` - Date range, type, status filters
   - `MoveDetailsModal.jsx` - Full transaction details

4. **Delivery/Receipts Components:**
   - `OrderTable.jsx` - Reusable for both deliveries/receipts
   - `OrderForm.jsx` - Create/edit order
   - `OrderStatusBadge.jsx` - Visual status indicator
   - `OrderActions.jsx` - Print, update tracking, validate

### **Computed Fields in Frontend:**

- **Stock Status**: Calculate based on `onHandQuantity` vs `reorderLevel` and `maxStockLevel`
  - Out of Stock: `onHandQuantity === 0`
  - Low Stock: `onHandQuantity > 0 AND onHandQuantity <= reorderLevel`
  - In Stock: `onHandQuantity > reorderLevel AND onHandQuantity < maxStockLevel`
  - Overstocked: `onHandQuantity >= maxStockLevel`

- **Available %**: `(availableQuantity / onHandQuantity) * 100`

- **Overdue Status**: `scheduledDate < today AND status !== 'VALIDATED'`

---

## 🔄 Migration Path

To apply these schema changes to your database:

```bash
# 1. Generate migration
cd backend
npx prisma migrate dev --name enhanced-schema-with-all-columns

# 2. Generate Prisma Client
npx prisma generate

# 3. (Optional) Seed sample data
npx prisma db seed
```

---

## ✅ Summary: What You Now Have

### **For Each Page:**

| Page | Columns Available | Status |
|------|-------------------|--------|
| **Dashboard** | 8 key metrics | ✅ Complete |
| **Stock** | 13 columns including cost, on-hand, free-to-use | ✅ Complete |
| **Move History** | 15 columns including reference, contact, dates, status | ✅ Complete |
| **Delivery** | 14 columns including contact, scheduling, tracking | ✅ Complete |
| **Receipts** | 15 columns including supplier, costs, payment terms | ✅ Complete |

### **Additional Benefits:**

✅ **Cost Tracking** - Full financial visibility  
✅ **Stock Availability** - On hand vs. free to use  
✅ **Contact Management** - Complete supplier/customer database  
✅ **Scheduling** - Expected vs. actual dates  
✅ **Priority Levels** - Urgent order handling  
✅ **Audit Trail** - Who did what and when  
✅ **Reservations** - Allocate stock for orders  
✅ **Barcodes** - Mobile scanning support  
✅ **Product Details** - Weight, dimensions, brand  
✅ **Performance** - Indexed for fast queries  

---

## 🎯 Next Steps

1. **Apply the migration** to update your PostgreSQL database
2. **Update API controllers** to return the new fields
3. **Update frontend components** to display all columns
4. **Add filtering & sorting** on new fields
5. **Implement computed values** (e.g., Available %, Stock Status)
6. **Add print/export features** for reports
7. **Test with sample data** using the seed script

---

**Schema Version:** 2.0  
**Last Updated:** November 22, 2025  
**Compatible With:** StockMaster IMS Frontend v1.0

