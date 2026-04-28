/* =============================================
   LOST & FOUND SYSTEM — DATA STORE
   js/data.js
   ============================================= */

const DB = (() => {
  // ── INITIAL SEED DATA ──
  const SEED = {
    users: [
      { id: 'u1', name: 'Admin User', email: 'admin@lnf.com', role: 'admin', avatar: 'A', password: 'admin123', createdAt: '2025-01-01' },
      { id: 'u2', name: 'Juan Dela Cruz', email: 'juan@example.com', role: 'user', avatar: 'J', password: 'user123', createdAt: '2025-03-10' },
      { id: 'u3', name: 'Maria Santos', email: 'maria@example.com', role: 'user', avatar: 'M', password: 'user123', createdAt: '2025-03-15' },
    ],
    items: [
      {
        id: 'item1', type: 'lost', category: 'Electronics', title: 'iPhone 14 Pro Max',
        description: 'Black iPhone 14 Pro Max with cracked screen protector and a teal case.',
        location: 'SM Seaside City, Cebu', lat: 10.2929, lng: 123.8784,
        date: '2025-04-10', status: 'matched', reportedBy: 'u2',
        image: null, tags: ['iphone', 'black', 'phone', 'cracked'], matchId: 'item4',
        claimProof: null, createdAt: '2025-04-10T08:30:00'
      },
      {
        id: 'item2', type: 'lost', category: 'Wallet/Purse', title: 'Black Leather Wallet',
        description: 'Black leather bifold wallet. Contains IDs and around PHP 500.',
        location: 'Ayala Center Cebu', lat: 10.3157, lng: 123.9054,
        date: '2025-04-12', status: 'lost', reportedBy: 'u2',
        image: null, tags: ['wallet', 'black', 'leather', 'bifold'], matchId: null,
        claimProof: null, createdAt: '2025-04-12T14:00:00'
      },
      {
        id: 'item3', type: 'found', category: 'ID/Cards', title: 'School ID - USJ-R',
        description: 'Found a USJ-R student ID near the canteen area.',
        location: 'USJ-R Main Campus', lat: 10.3119, lng: 123.9138,
        date: '2025-04-13', status: 'found', reportedBy: 'u3',
        image: null, tags: ['id', 'school', 'usjr', 'student'], matchId: null,
        claimProof: null, createdAt: '2025-04-13T11:15:00'
      },
      {
        id: 'item4', type: 'found', category: 'Electronics', title: 'iPhone (Teal Case)',
        description: 'Found an iPhone with a teal-green case near food court.',
        location: 'SM Seaside City, Cebu', lat: 10.2930, lng: 123.8785,
        date: '2025-04-11', status: 'matched', reportedBy: 'u3',
        image: null, tags: ['iphone', 'teal', 'phone', 'found'], matchId: 'item1',
        claimProof: null, createdAt: '2025-04-11T16:00:00'
      },
      {
        id: 'item5', type: 'lost', category: 'Bag/Backpack', title: 'Blue Jansport Backpack',
        description: 'Blue Jansport backpack with books and a laptop inside. Last seen at Gaisano mall.',
        location: 'Gaisano Country Mall, Cebu', lat: 10.3415, lng: 123.9091,
        date: '2025-04-14', status: 'lost', reportedBy: 'u2',
        image: null, tags: ['bag', 'backpack', 'jansport', 'blue'], matchId: null,
        claimProof: null, createdAt: '2025-04-14T09:00:00'
      },
      {
        id: 'item6', type: 'found', category: 'Keys', title: 'Car Keys w/ Keychain',
        description: 'Found Toyota car keys with a rubber duck keychain.',
        location: 'Robinsons Galleria, Cebu', lat: 10.3222, lng: 123.9000,
        date: '2025-04-15', status: 'returned', reportedBy: 'u3',
        image: null, tags: ['keys', 'toyota', 'car', 'keychain'], matchId: null,
        claimProof: null, createdAt: '2025-04-15T10:30:00'
      },
    ],
    notifications: [
      { id: 'n1', userId: 'u2', title: 'Match Found!', message: 'Your lost iPhone 14 Pro Max may have been found!', type: 'match', read: false, createdAt: '2025-04-11T17:00:00', itemId: 'item1' },
      { id: 'n2', userId: 'u2', title: 'Item Reported', message: 'Your item "Black Leather Wallet" has been reported successfully.', type: 'info', read: true, createdAt: '2025-04-12T14:05:00', itemId: 'item2' },
    ],
    activityLog: [
      { id: 'log1', action: 'Item Reported', detail: 'Juan reported lost iPhone 14 Pro Max', userId: 'u2', createdAt: '2025-04-10T08:30:00' },
      { id: 'log2', action: 'Item Reported', detail: 'Maria reported found iPhone (Teal Case)', userId: 'u3', createdAt: '2025-04-11T16:00:00' },
      { id: 'log3', action: 'Match Created', detail: 'System matched item1 with item4', userId: 'system', createdAt: '2025-04-11T16:01:00' },
      { id: 'log4', action: 'Item Claimed', detail: 'Car Keys returned to owner', userId: 'u3', createdAt: '2025-04-15T12:00:00' },
    ],
    session: null
  };

  // ── STORAGE HELPERS ──
  const load = (key) => {
    try {
      const raw = localStorage.getItem('lnf_' + key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };
  const save = (key, val) => {
    try { localStorage.setItem('lnf_' + key, JSON.stringify(val)); } catch {}
  };

  // ── INIT: seed if first run ──
  const init = () => {
    if (!load('initialized')) {
      Object.keys(SEED).forEach(k => save(k, SEED[k]));
      save('initialized', true);
    }
  };

  // ── GETTERS ──
  const getAll   = (col)      => load(col) || [];
  const getById  = (col, id)  => getAll(col).find(x => x.id === id) || null;
  const getWhere = (col, fn)  => getAll(col).filter(fn);

  // ── SETTERS ──
  const addRecord = (col, obj) => {
    const list = getAll(col);
    list.unshift(obj);
    save(col, list);
    return obj;
  };
  const updateRecord = (col, id, patch) => {
    const list = getAll(col).map(x => x.id === id ? { ...x, ...patch } : x);
    save(col, list);
    return list.find(x => x.id === id);
  };
  const deleteRecord = (col, id) => {
    const list = getAll(col).filter(x => x.id !== id);
    save(col, list);
  };

  // ── AUTH ──
  const getSession = () => load('session');
  const setSession = (user) => save('session', user);
  const clearSession = () => save('session', null);
  const login = (email, password) => {
    const user = getWhere('users', u => u.email === email && u.password === password)[0];
    if (user) { setSession(user); return user; }
    return null;
  };
  const register = (name, email, password) => {
    if (getWhere('users', u => u.email === email).length) return null;
    const user = { id: 'u' + Date.now(), name, email, password, role: 'user', avatar: name[0].toUpperCase(), createdAt: new Date().toISOString() };
    addRecord('users', user);
    setSession(user);
    return user;
  };

  // ── ITEMS ──
  const getItems = (filters = {}) => {
    let items = getAll('items');
    if (filters.type)     items = items.filter(i => i.type === filters.type);
    if (filters.status)   items = items.filter(i => i.status === filters.status);
    if (filters.category) items = items.filter(i => i.category === filters.category);
    if (filters.userId)   items = items.filter(i => i.reportedBy === filters.userId);
    if (filters.q) {
      const q = filters.q.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.includes(q))
      );
    }
    return items;
  };

  const addItem = (data) => {
    const id = 'item' + Date.now();
    const item = { id, ...data, status: data.type, matchId: null, claimProof: null, createdAt: new Date().toISOString() };
    addRecord('items', item);
    addLog('Item Reported', `${data.type === 'lost' ? 'Lost' : 'Found'} item reported: ${data.title}`, data.reportedBy);
    runAutoMatch(item);
    return item;
  };

  // ── AUTO-MATCH ENGINE ──
  const runAutoMatch = (newItem) => {
    const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
    const candidates = getWhere('items', i => i.type === oppositeType && !i.matchId && i.status === oppositeType);
    let bestMatch = null, bestScore = 0;

    candidates.forEach(candidate => {
      let score = 0;
      // Keyword match
      const newWords = (newItem.title + ' ' + newItem.description).toLowerCase().split(/\s+/);
      const canWords = (candidate.title + ' ' + candidate.description).toLowerCase().split(/\s+/);
      const common = newWords.filter(w => w.length > 3 && canWords.includes(w));
      score += common.length * 15;
      // Category match
      if (newItem.category === candidate.category) score += 25;
      // Tag overlap
      const tagOverlap = (newItem.tags || []).filter(t => (candidate.tags || []).includes(t));
      score += tagOverlap.length * 10;
      // Location proximity (simple)
      const dist = Math.sqrt(Math.pow(newItem.lat - candidate.lat, 2) + Math.pow(newItem.lng - candidate.lng, 2));
      if (dist < 0.01) score += 20;
      else if (dist < 0.05) score += 10;
      // Date proximity
      const daysDiff = Math.abs(new Date(newItem.date) - new Date(candidate.date)) / 86400000;
      if (daysDiff <= 1) score += 15;
      else if (daysDiff <= 3) score += 8;

      if (score > bestScore) { bestScore = score; bestMatch = candidate; }
    });

    if (bestMatch && bestScore >= 30) {
      updateRecord('items', newItem.id, { matchId: bestMatch.id, status: 'matched' });
      updateRecord('items', bestMatch.id, { matchId: newItem.id, status: 'matched' });
      // Notify users
      const lostItem = newItem.type === 'lost' ? newItem : bestMatch;
      const foundItem = newItem.type === 'found' ? newItem : bestMatch;
      addNotification(lostItem.reportedBy, 'Match Found! 🎉', `Your lost "${lostItem.title}" may have been found! Score: ${bestScore}%`, 'match', lostItem.id);
      addLog('Match Created', `System matched "${lostItem.title}" with found item (score: ${bestScore})`, 'system');
    }
  };

  const getMatchScore = (item1, item2) => {
    let score = 0;
    const w1 = (item1.title + ' ' + item1.description).toLowerCase().split(/\s+/);
    const w2 = (item2.title + ' ' + item2.description).toLowerCase().split(/\s+/);
    const common = w1.filter(w => w.length > 3 && w2.includes(w));
    score += common.length * 15;
    if (item1.category === item2.category) score += 25;
    const tagOverlap = (item1.tags || []).filter(t => (item2.tags || []).includes(t));
    score += tagOverlap.length * 10;
    return Math.min(score, 100);
  };

  // ── NOTIFICATIONS ──
  const addNotification = (userId, title, message, type = 'info', itemId = null) => {
    const notif = { id: 'n' + Date.now(), userId, title, message, type, read: false, createdAt: new Date().toISOString(), itemId };
    addRecord('notifications', notif);
    return notif;
  };
  const getNotifications = (userId) => getWhere('notifications', n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const markNotifRead = (id) => updateRecord('notifications', id, { read: true });
  const getUnreadCount = (userId) => getWhere('notifications', n => n.userId === userId && !n.read).length;

  // ── ACTIVITY LOG ──
  const addLog = (action, detail, userId) => {
    addRecord('activityLog', { id: 'log' + Date.now(), action, detail, userId, createdAt: new Date().toISOString() });
  };
  const getLogs = () => getAll('activityLog').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ── STATS ──
  const getStats = () => {
    const items = getAll('items');
    return {
      total:    items.length,
      lost:     items.filter(i => i.status === 'lost').length,
      found:    items.filter(i => i.status === 'found').length,
      matched:  items.filter(i => i.status === 'matched').length,
      claimed:  items.filter(i => i.status === 'claimed').length,
      returned: items.filter(i => i.status === 'returned').length,
      users:    getAll('users').length,
    };
  };

  // ── CATEGORIES ──
  const CATEGORIES = ['Electronics', 'Wallet/Purse', 'ID/Cards', 'Keys', 'Bag/Backpack', 'Clothing', 'Jewelry', 'Documents', 'Eyewear', 'Others'];

  init();
  return { getSession, setSession, clearSession, login, register, getItems, addItem, getById, updateRecord, deleteRecord, getAll, getWhere, addNotification, getNotifications, markNotifRead, getUnreadCount, getLogs, getStats, CATEGORIES, runAutoMatch, getMatchScore, addLog };
})();
