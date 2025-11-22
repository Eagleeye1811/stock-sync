# Role-Based Access Control - Testing Guide

## 🧪 Quick Testing Instructions

### Prerequisites
Ensure both backend and frontend are running:

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should start on http://localhost:5001

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Should start on http://localhost:3000
```

---

## Test Plan

### ✅ Test 1: ADMIN Access (Full Control)

**Login:**
- Email: `admin@stockmaster.com`
- Password: `password123`

**Expected Navigation Items:**
- ✅ Dashboard
- ✅ Products
- ✅ Stock
- ✅ Operations (Receipts, Deliveries, Transfers)
- ✅ Move History

**Test Actions:**
1. Navigate to Products → ✅ Should load successfully
2. Navigate to Move History → ✅ Should load successfully
3. Create a Receipt → ✅ Should work
4. Validate the Receipt → ✅ Should show validate button and work
5. Try to delete a location (via API) → ✅ Should work

**Expected Result:** ✅ Full access to everything

---

### ✅ Test 2: MANAGER Access (Management Features)

**Login:**
- Email: `manager@stockmaster.com`
- Password: `password123`

**Expected Navigation Items:**
- ✅ Dashboard
- ✅ Products
- ✅ Stock
- ✅ Operations (Receipts, Deliveries, Transfers)
- ✅ Move History

**Test Actions:**
1. Navigate to Products → ✅ Should load successfully
2. Navigate to Move History → ✅ Should load successfully
3. Create a Delivery → ✅ Should work
4. Validate the Delivery → ✅ Should show validate button and work
5. Create a new Product → ✅ Should work
6. Try to delete a location (via API) → ❌ Should return 403 Forbidden

**Expected Result:** ✅ Can manage inventory but not delete critical resources

---

### ⭐ Test 3: STAFF Access (Limited - Most Critical Test)

**Login:**
- Email: `staff@stockmaster.com`
- Password: `password123`

**Expected Navigation Items (Only 3):**
- ✅ Dashboard
- ✅ Stock  
- ✅ Operations (Receipts, Deliveries, Transfers)

**Should NOT See:**
- ❌ Products
- ❌ Move History

**Test Actions:**

1. **Check Navigation:**
   - ✅ Should only see 3 menu items
   - ❌ "Products" should be completely hidden
   - ❌ "Move History" should be completely hidden

2. **Access Allowed Pages:**
   - Navigate to Dashboard → ✅ Should load
   - Navigate to Stock → ✅ Should load
   - Navigate to Operations/Receipts → ✅ Should load

3. **Try to Access Restricted Pages (URL Navigation):**
   - Type `/products` in address bar → ❌ Should redirect to /dashboard
   - Type `/inventory/ledger` in address bar → ❌ Should redirect to /dashboard

4. **Create Operation (Draft):**
   - Go to Operations → Receipts
   - Click "Create Receipt" → ✅ Should work
   - Fill in product, location, quantity
   - Save → ✅ Should create with status "DRAFT"

5. **Try to Validate Operation:**
   - ❌ Validate button should NOT be visible
   - If attempted via API → Should return 403 Forbidden

6. **Try to Access Restricted API Endpoints:**
   ```bash
   # Get STAFF user's token from browser localStorage
   # Try to validate an operation
   curl -X POST http://localhost:5001/api/operations/validate/MOVE_ID \
     -H "Authorization: Bearer STAFF_TOKEN"
   
   # Expected: 403 Forbidden
   # {
   #   "success": false,
   #   "message": "User role 'STAFF' is not authorized to access this route"
   # }
   ```

**Expected Result:** 
- ✅ Can view inventory and create draft operations
- ❌ Cannot validate operations (needs Manager approval)
- ❌ Cannot access Products or Move History
- ❌ Cannot perform management actions

---

## 🎯 Key Behaviors to Verify

### Navigation Filtering
| User Role | Dashboard | Products | Stock | Operations | Move History |
|-----------|-----------|----------|-------|------------|--------------|
| ADMIN     | ✅        | ✅       | ✅    | ✅         | ✅           |
| MANAGER   | ✅        | ✅       | ✅    | ✅         | ✅           |
| STAFF     | ✅        | ❌       | ✅    | ✅         | ❌           |

### Operation Permissions
| Action | ADMIN | MANAGER | STAFF |
|--------|-------|---------|-------|
| Create Receipt/Delivery | ✅ | ✅ | ✅ |
| Validate Operation | ✅ | ✅ | ❌ |
| Cancel Operation | ✅ | ✅ | ❌ |
| View All History | ✅ | ✅ | ❌ |

### Product Management
| Action | ADMIN | MANAGER | STAFF |
|--------|-------|---------|-------|
| View Products | ✅ | ✅ | ❌ |
| Create Product | ✅ | ✅ | ❌ |
| Edit Product | ✅ | ✅ | ❌ |
| Delete Product | ✅ | ❌ | ❌ |

---

## 📱 Mobile Testing (Optional)

### Test on Mobile Device or Resize Browser

1. **Resize browser to mobile width (< 768px)**
2. Login as any user
3. Navigation should collapse to hamburger menu
4. Sidebar should slide in from left
5. Layout should be responsive

### STAFF Mobile Workflow
1. Login as STAFF user on mobile
2. Should see simplified interface
3. Can quickly create receipts/deliveries
4. Easy access to stock lookup

---

## 🐛 Troubleshooting

### Issue: All users see all menu items
**Solution:** Clear browser cache and localStorage, then refresh

### Issue: STAFF can access Products page
**Solution:** Check that RoleProtectedRoute is properly wrapping the route in App.jsx

### Issue: Backend returns 401 instead of 403
**Solution:** Check that JWT token is being sent in Authorization header

### Issue: Navigation not filtering
**Solution:** 
1. Check that user object has `role` field
2. Verify `filterNavigationByRole` is being called in MainLayout
3. Check browser console for errors

---

## ✅ Success Criteria

Your implementation is working correctly if:

1. ✅ ADMIN sees all 5 navigation items
2. ✅ MANAGER sees all 5 navigation items  
3. ✅ STAFF sees only 3 navigation items (no Products, no Move History)
4. ✅ Direct URL access to restricted pages redirects STAFF to dashboard
5. ✅ STAFF cannot validate operations (button hidden)
6. ✅ Backend returns 403 when STAFF tries to call protected endpoints
7. ✅ All users can log in and access their permitted features
8. ✅ Navigation menu filters automatically based on role
9. ✅ No console errors
10. ✅ Responsive design works on mobile

---

## 📊 Testing Checklist

- [ ] Test ADMIN login and full access
- [ ] Test MANAGER login and management access
- [ ] Test STAFF login and limited access
- [ ] Verify navigation filtering for each role
- [ ] Test direct URL access to restricted pages
- [ ] Verify STAFF cannot validate operations
- [ ] Test backend API authorization (403 responses)
- [ ] Test responsive design on mobile
- [ ] Check for console errors
- [ ] Verify logout works for all roles

---

## 🎉 Expected Final Result

**Single Application, Three Different Experiences:**

1. **ADMIN Experience:**
   - Full dashboard with all features
   - Complete control over system
   - Can manage users and settings

2. **MANAGER Experience:**
   - Inventory management dashboard
   - Can validate operations
   - Cannot delete critical resources
   - Desktop-optimized workflows

3. **STAFF Experience:**
   - Simplified interface
   - Create operations only
   - No access to management features
   - Mobile-friendly (ready for barcode scanning)

**Security Model:**
- Frontend hides unauthorized features (UX)
- Backend enforces authorization (Security)
- Cannot bypass with URL manipulation
- All sensitive operations protected

---

**Your system now implements enterprise-grade role-based access control!** 🔐

