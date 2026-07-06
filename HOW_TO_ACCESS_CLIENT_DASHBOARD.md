# 🎯 How to Access the Client Dashboard

## Quick Start (2 Steps)

### Step 1: Ensure Servers Are Running
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Expected Output**:
- Backend: `🚀 Backend server running on http://localhost:5000`
- Frontend: `➜ Local: http://localhost:5174/`

---

### Step 2: Switch to Client View

**Option A: Modify App.jsx (Temporary)**

Open `frontend/src/App.jsx` and change line 7:

```javascript
// Change from:
const [activePage, setActivePage] = useState('support');

// To:
const [activePage, setActivePage] = useState('client');
```

Then visit: **http://localhost:5174**

**Option B: Browser Console (Quick Test)**

1. Visit http://localhost:5174
2. Open browser console (F12)
3. Type: `window.location.href = '?view=client'` (if routing was implemented)
4. OR temporarily modify the Support Dashboard sidebar to add a "Client Portal" link

---

## 🎨 What You'll See

### Client Dashboard Home
- Welcome message: "Welcome Back, Alex!"
- 4 stat cards: Total Tickets, Open, Pending, Resolved
- Recent Tickets table (empty initially)
- Knowledge Base card (purple)
- Live Support card (blue gradient)

### Create Your First Ticket
1. Click the **"+ New Ticket"** button (top right)
2. Fill in the form:
   - **Subject**: Enter a brief title
   - **Category**: Choose from dropdown (Technical Support, Billing, etc.)
   - **Priority**: Select Low, Medium, High, or Critical
   - **Description**: Detailed description
3. Click **"Create Ticket"**
4. Your ticket appears in the Recent Tickets table

### View Ticket Details
1. Click **"View Details ›"** on any ticket
2. A drawer slides in from the right showing:
   - Ticket header with ID
   - Status, Priority, Category, Assignee
   - SLA times (response & resolution)
   - Full description
   - Communication thread
   - Reply box (type message + click Send)
   - Action buttons (Close/Reopen based on status)

---

## 🧪 Testing the Features

### Test Ticket Lifecycle

**1. Create a Ticket**
```
Title: "Login button not working"
Category: Bug Report
Priority: High
Description: "When I click the login button, nothing happens. Browser: Chrome 120"
```

**2. Add a Comment**
- Open the ticket detail drawer
- Type a message in the reply box
- Click "Send Message" or press Ctrl+Enter

**3. Close a Ticket** (Only after support marks it Resolved)
- Ticket must be in "Resolved" status first
- Click the "Close Ticket" button
- Confirm the action

**4. Reopen a Ticket**
- Works only on "Closed" tickets
- Click the "Reopen Ticket" button
- Ticket changes back to "Open" status

---

## 🔍 API Testing (Optional)

Test the backend directly using PowerShell:

```powershell
# Get dashboard stats
Invoke-WebRequest -Uri "http://localhost:5000/api/client/dashboard/stats" | Select-Object -ExpandProperty Content

# Get all tickets
Invoke-WebRequest -Uri "http://localhost:5000/api/client/tickets" | Select-Object -ExpandProperty Content

# Get categories
Invoke-WebRequest -Uri "http://localhost:5000/api/client/categories" | Select-Object -ExpandProperty Content

# Get notifications
Invoke-WebRequest -Uri "http://localhost:5000/api/client/notifications" | Select-Object -ExpandProperty Content
```

---

## 🎭 Mock User Details

**Authenticated As**:
- Name: Alex Thompson
- Role: Client
- ID: `00000000-0000-0000-0000-000000000002`
- Email: alex@example.com

All tickets and actions are scoped to this user.

---

## 🐛 Troubleshooting

### "No tickets yet" message
✅ **Expected** - Create your first ticket using the "+ New Ticket" button

### "Category dropdown is empty"
Run the seed script:
```bash
cd backend
node seed-data.js
```

### Frontend shows wrong view
Check `App.jsx` line 7 - should be `useState('client')`

### Port 5174 not loading
Check if frontend dev server is running. Port may vary (5173, 5174, etc.)

### Backend API errors
1. Verify backend is running on port 5000
2. Check `.env` file has correct database credentials
3. Ensure MariaDB is running

---

## 📸 Expected UI

```
┌─────────────────────────────────────────────────────┐
│  [Sidebar]    Welcome Back, Alex!    [+ New Ticket] │
│  🏠 Dashboard                                        │
│  🎫 My Tickets  ┌─────┬─────┬─────┬─────┐          │
│  📚 Knowledge   │  0  │  0  │  0  │  0  │          │
│  ⚙️ Settings    │Total│Open │Pend │Resv │          │
│                 └─────┴─────┴─────┴─────┘          │
│  🔔 3           ┌───────────────────┐ ┌──────────┐ │
│                 │ Recent Tickets    │ │ Knowledge│ │
│  Profile: Alex  │ (Empty State)     │ │ Base     │ │
│  alex@example   │ 📭 No tickets yet │ │ Card     │ │
└─────────────────┴───────────────────┴─┴──────────┴─┘
```

---

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5174
- [ ] Database seeded (5 categories visible)
- [ ] Client dashboard visible (not support dashboard)
- [ ] Can create a new ticket
- [ ] Ticket appears in Recent Tickets table
- [ ] Can view ticket details (drawer opens)
- [ ] Can add comments to tickets
- [ ] Stats cards update after creating tickets

---

## 🎉 You're All Set!

The Client Dashboard is fully functional and ready to use. Start by creating your first support ticket!

**Support**: If you encounter issues, check the console logs (F12) for detailed error messages.
