# 🔍 LostFind — Lost & Found Tracking System

A complete, defense-ready Lost & Found web system. No backend, no billing — runs fully in the browser using localStorage.

---

## 📁 File Structure

```
lostfound/
├── index.html          ← Homepage (hero, stats, recent items, categories)
├── browse.html         ← Browse & search all items (filters, autocomplete)
├── report.html         ← Report lost or found item (with live match preview)
├── map.html            ← Interactive map (OpenStreetMap — FREE, no billing)
├── auth.html           ← Login & Register
├── profile.html        ← User profile, my items, notifications, matches
├── notifications.html  ← Notifications page
├── qr.html             ← QR Tag Generator for valuables
├── admin.html          ← Admin dashboard (tables, analytics, activity log)
│
├── css/
│   └── style.css       ← All styles, design tokens, components
│
└── js/
    ├── data.js         ← Data store, DB operations, auto-match engine, auth
    └── ui.js           ← UI utilities, toasts, modals, card renderer, helpers
```

---

## 🚀 How to Run

Just open `index.html` in a browser — no server or install needed.

Or use VS Code Live Server for best results.

---

## 🔑 Demo Accounts

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@lnf.com     | admin123  |
| User  | juan@example.com  | user123   |
| User  | maria@example.com | user123   |

---

## ✅ Features Implemented

### Core
- [x] Lost & Found item reporting (with image upload)
- [x] Category selection (10 categories)
- [x] **Auto-Match Engine** — keyword, category, tag, location, date scoring
- [x] **Smart Search + Autocomplete** with keyword highlighting
- [x] Status tracking: Lost → Matched → Claimed → Returned
- [x] Map view using **OpenStreetMap (FREE, no billing)**

### Security & Verification
- [x] User authentication (login / register)
- [x] Claim verification with proof description + image upload
- [x] Admin role access control

### Advanced
- [x] **QR Code tag generator** (QRCode.js — free)
- [x] Notification system (in-app)
- [x] Activity log
- [x] Admin dashboard with analytics charts
- [x] Hotspot locations analysis

### UX
- [x] Dark mode design with accent theming
- [x] Mobile-responsive layout
- [x] Toast notifications
- [x] Modal system
- [x] Drag & drop image upload
- [x] Live match preview while typing report

---

## 🗺️ APIs Used (All Free, No Billing)

| API | Purpose | Billing? |
|-----|---------|----------|
| OpenStreetMap (Leaflet) | Interactive map with pins | ❌ Free forever |
| QRCode.js (CDN) | QR tag generation | ❌ Free |
| Google Fonts | Typography | ❌ Free |

---

## 🎓 Defense Tips

- **Auto-match**: "Our system scores matches using 5 factors: keyword overlap, category, tags, GPS proximity, and date range."
- **QR tagging**: "Users can tag valuables before losing them. Finders scan and contact owner directly."
- **No backend**: "All data is stored securely in the browser localStorage. This is ideal for a prototype/demo."
- **Map**: "We use OpenStreetMap which is free, open-source, and used by major companies like Wikipedia and Craigslist."
