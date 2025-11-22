# Quick Start: Role Management

## ✅ How Role Assignment Works in Your System

### **Users CANNOT Select Their Own Roles** (Security Feature)

- ✅ **Public Registration** → Always creates STAFF users
- ✅ **Administrators** → Create users with any role via API
- ✅ **Administrators** → Change user roles via API

---

## 🚀 Quick Test Guide

### **Step 1: Test Public Registration (Creates STAFF)**

```bash
# Start your backend first
cd backend
npm run dev

# Then register a new user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "test123",
    "firstName": "New",
    "lastName": "User"
  }'

# Result: User is created with role "STAFF"
```

**In Frontend:**
1. Go to `http://localhost:3000/register`
2. Fill in the form (no role selector shown)
3. Submit → New user automatically becomes STAFF

---

### **Step 2: Create a MANAGER Account (Admin Only)**

```bash
# 1. Login as admin to get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@stockmaster.com",
    "password": "password123"
  }'

# Copy the "token" from response

# 2. Create manager account (replace YOUR_ADMIN_TOKEN)
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "newmanager@company.com",
    "password": "manager123",
    "firstName": "Sarah",
    "lastName": "Manager",
    "role": "MANAGER"
  }'

# Result: New user created with MANAGER role
```

---

### **Step 3: Change Existing User's Role**

```bash
# 1. Get list of all users (to find user ID)
curl -X GET http://localhost:5001/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# 2. Copy the "id" of the user you want to promote

# 3. Change their role (replace USER_ID and TOKEN)
curl -X PATCH http://localhost:5001/api/users/USER_ID/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"role": "MANAGER"}'

# Result: User's role changed to MANAGER
```

---

## 🎯 Common Scenarios

### **Scenario 1: Hire New Warehouse Manager**

**Goal:** Create a manager account immediately

**Solution:** Use admin API to create user with MANAGER role

```bash
curl -X POST http://localhost:5001/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "email": "manager@company.com",
    "password": "temp123",
    "firstName": "John",
    "lastName": "Manager",
    "role": "MANAGER"
  }'
```

---

### **Scenario 2: Promote Warehouse Staff to Manager**

**Goal:** Existing STAFF user gets promoted

**Solution:** 

```bash
# Step 1: Find the user
curl -X GET http://localhost:5001/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Step 2: Update their role
curl -X PATCH http://localhost:5001/api/users/USER_ID/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"role": "MANAGER"}'
```

The user will need to logout and login again to see new permissions.

---

### **Scenario 3: New Employee Self-Registers**

**Goal:** Let employees create their own accounts

**Solution:** They use the registration page, automatically become STAFF

**Steps:**
1. Employee goes to registration page
2. Fills in details (no role selection)
3. Submits form
4. Account created as STAFF
5. Admin can promote later if needed

---

## 📊 Available Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **STAFF** | - View dashboard<br>- View stock<br>- Create operations (draft)<br>- View receipts/deliveries | - Validate operations<br>- Manage products<br>- View move history<br>- Delete anything |
| **MANAGER** | Everything STAFF can do, plus:<br>- Validate operations<br>- Manage products<br>- View move history<br>- Create/edit locations | - Delete locations<br>- Manage users<br>- Change settings |
| **ADMIN** | Everything MANAGER can do, plus:<br>- Delete anything<br>- Manage users<br>- Change user roles<br>- System settings | Nothing restricted |

---

## 🔑 How to Get Admin Token

### **Method 1: Using cURL (Terminal)**

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@stockmaster.com",
    "password": "password123"
  }'
```

Copy the `token` value from response.

### **Method 2: Using Browser Console**

1. Login as admin in the browser
2. Press F12 (open DevTools)
3. Go to **Application** tab
4. Click **Local Storage** → `http://localhost:3000`
5. Find `auth-storage` → Look for `token` field
6. Copy the token value

### **Method 3: Using Postman/Insomnia**

1. Create POST request to `http://localhost:5001/api/auth/login`
2. Set body to JSON:
   ```json
   {
     "email": "admin@stockmaster.com",
     "password": "password123"
   }
   ```
3. Send request
4. Copy token from response

---

## 🧪 Test Checklist

Test these scenarios to verify role management:

```
□ Register new user → Should become STAFF
□ Login as admin → Should get token
□ Create user with MANAGER role → Should succeed
□ Login as new manager → Should have MANAGER permissions
□ Try to create user as STAFF → Should fail (403 Forbidden)
□ Change STAFF user to MANAGER → Should succeed
□ Logout and login as promoted user → Should see new permissions
□ Try to change own role as admin → Should fail (security)
```

---

## 📱 Future: Admin Panel UI

**Coming Soon:** Visual interface for role management

**Will Include:**
- User list table with search
- Create user button with role dropdown
- Edit user modal
- Change role dropdown
- Activate/Deactivate toggle
- Reset password button

**Location:** `/settings/users` (ADMIN only)

---

## ⚠️ Important Security Notes

### **DO:**
✅ Keep admin credentials secure  
✅ Use strong passwords for all accounts  
✅ Regularly review user roles  
✅ Deactivate users who leave (don't delete)  
✅ Promote users only when necessary  

### **DON'T:**
❌ Share admin tokens  
❌ Let users select their own roles  
❌ Create too many admin accounts  
❌ Use weak passwords  
❌ Delete users (deactivate instead for audit trail)  

---

## 🔍 Troubleshooting

### **Issue: "User role 'STAFF' is not authorized"**

**Cause:** STAFF user trying to access admin endpoint

**Solution:** Login as ADMIN or have admin change user's role

---

### **Issue: "Cannot change your own role"**

**Cause:** Admin trying to change their own role

**Solution:** This is security feature. Use different admin account or contact another admin

---

### **Issue: Registration creates user but with wrong role**

**Cause:** Not possible - registration is hardcoded to STAFF

**Solution:** If you need different role, admin must change it via API

---

## 📞 Summary

### **For Regular Users:**
- Register normally → Automatically STAFF
- Wait for admin if need promotion

### **For Administrators:**
- Use API to create users with specific roles
- Use API to change existing user roles
- Cannot change own role (security)
- Full documentation in `USER_ROLE_ASSIGNMENT.md`

### **Security Model:**
- Public registration → STAFF only
- Role changes → ADMIN only
- Self-protection → Cannot modify own role
- Audit trail → User activities logged

---

**Your system is now secure with proper role management!** 🔒

See `USER_ROLE_ASSIGNMENT.md` for complete API documentation.

