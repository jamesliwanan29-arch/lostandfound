/* =============================================
   LOST & FOUND SYSTEM — UI UTILITIES
   js/ui.js
   ============================================= */

const UI = (() => {

  // ── TOAST NOTIFICATIONS ──
  const toastContainer = (() => {
    const el = document.createElement('div');
    el.className = 'toast-container';
    document.body.appendChild(el);
    return el;
  })();

  const toast = (message, type = 'info', duration = 3500) => {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    toastContainer.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => { t.classList.add('show'); }); });
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, duration);
  };

  // ── MODAL SYSTEM ──
  let activeModal = null;
  const openModal = (id) => {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    activeModal = id;
    document.body.style.overflow = 'hidden';
  };
  const closeModal = (id) => {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    activeModal = null;
    document.body.style.overflow = '';
  };
  const closeAllModals = () => {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    activeModal = null;
    document.body.style.overflow = '';
  };

  // Close modal on overlay click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) closeAllModals();
    if (e.target.classList.contains('modal-close')) {
      const overlay = e.target.closest('.modal-overlay');
      if (overlay) closeModal(overlay.id);
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });

  // ── TABS ──
  const initTabs = (containerSelector) => {
    document.querySelectorAll(containerSelector || '.tabs').forEach(tabsEl => {
      tabsEl.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          const parent = btn.closest('[data-tabs-parent]') || document;
          // Deactivate all
          tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          // Activate clicked
          btn.classList.add('active');
          const panel = parent.querySelector(`[data-tab-panel="${target}"]`);
          if (panel) panel.classList.add('active');
        });
      });
    });
  };

  // ── FILTER CHIPS ──
  const initFilterChips = (selector, onChange) => {
    document.querySelectorAll(selector).forEach(chip => {
      chip.addEventListener('click', () => {
        const parent = chip.closest('.filters-row') || chip.parentElement;
        parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (onChange) onChange(chip.dataset.filter);
      });
    });
  };

  // ── UPLOAD ZONE ──
  const initUploadZone = (zoneEl, onFile) => {
    if (!zoneEl) return;
    const input = zoneEl.querySelector('input[type="file"]');
    zoneEl.addEventListener('dragover', e => { e.preventDefault(); zoneEl.classList.add('drag-over'); });
    zoneEl.addEventListener('dragleave', () => zoneEl.classList.remove('drag-over'));
    zoneEl.addEventListener('drop', e => {
      e.preventDefault();
      zoneEl.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file, zoneEl, onFile);
    });
    if (input) {
      input.addEventListener('change', () => {
        if (input.files[0]) handleFileUpload(input.files[0], zoneEl, onFile);
      });
    }
  };

  const handleFileUpload = (file, zoneEl, onFile) => {
    if (!file.type.startsWith('image/')) { toast('Please upload an image file.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      const preview = zoneEl.querySelector('.upload-preview');
      if (preview) {
        preview.innerHTML = `<img src="${dataUrl}" style="max-height:160px;border-radius:8px;object-fit:contain;">`;
      } else {
        zoneEl.innerHTML += `<div class="upload-preview" style="margin-top:12px;"><img src="${dataUrl}" style="max-height:160px;border-radius:8px;object-fit:contain;"></div>`;
      }
      if (onFile) onFile(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // ── AUTOCOMPLETE SEARCH ──
  const initSearch = (inputEl, suggestionsEl, dataFn, onSelect) => {
    if (!inputEl) return;
    let timeout;
    inputEl.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const q = inputEl.value.trim();
        if (q.length < 2) { suggestionsEl && suggestionsEl.classList.remove('open'); return; }
        const results = dataFn(q);
        if (suggestionsEl) {
          suggestionsEl.innerHTML = results.slice(0, 6).map(r =>
            `<div class="suggestion-item" data-id="${r.id}">
              <span class="sug-icon">${getCategoryIcon(r.category)}</span>
              <div>
                <div style="font-weight:600;font-size:13px">${highlight(r.title, q)}</div>
                <div style="font-size:11px;color:var(--text-muted)">${r.location} · ${r.type}</div>
              </div>
              <span class="badge badge-${r.status}" style="margin-left:auto">${r.status}</span>
            </div>`
          ).join('') || '<div class="suggestion-item" style="color:var(--text-muted)">No results found</div>';
          suggestionsEl.classList.add('open');
          suggestionsEl.querySelectorAll('.suggestion-item[data-id]').forEach(el => {
            el.addEventListener('click', () => {
              if (onSelect) onSelect(el.dataset.id);
              suggestionsEl.classList.remove('open');
              inputEl.value = '';
            });
          });
        }
      }, 200);
    });
    document.addEventListener('click', e => {
      if (!inputEl.contains(e.target) && suggestionsEl && !suggestionsEl.contains(e.target)) {
        suggestionsEl.classList.remove('open');
      }
    });
  };

  // ── RENDER NAVBAR ──
  const renderNavbar = () => {
    const session = DB.getSession();
    const unread = session ? DB.getUnreadCount(session.id) : 0;
    return `
    <nav class="navbar">
      <div class="container">
        <a href="index.html" class="nav-logo">
          <div class="logo-icon">🔍</div>
          <span>LostFind</span>
        </a>
        <div class="nav-links">
          <a href="index.html" ${isActive('index')}>Home</a>
          <a href="browse.html" ${isActive('browse')}>Browse Items</a>
          <a href="report.html" ${isActive('report')}>Report Item</a>
          <a href="map.html" ${isActive('map')}>Map</a>
          ${session?.role === 'admin' ? `<a href="admin.html" ${isActive('admin')}>Admin</a>` : ''}
        </div>
        <div class="nav-actions">
          ${session ? `
            <a href="notifications.html" class="btn btn-ghost btn-sm" style="position:relative">
              🔔${unread > 0 ? `<span style="position:absolute;top:-4px;right:-4px;background:var(--accent2);color:#fff;font-size:10px;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;font-weight:700">${unread}</span>` : ''}
            </a>
            <a href="profile.html" class="nav-user">
              <div class="avatar">${session.avatar}</div>
              <span>${session.name.split(' ')[0]}</span>
            </a>
          ` : `
            <a href="auth.html" class="btn btn-ghost btn-sm">Login</a>
            <a href="auth.html" class="btn btn-primary btn-sm">Register</a>
          `}
        </div>
        <button class="hamburger" onclick="document.querySelector('.nav-links').style.display=document.querySelector('.nav-links').style.display==='flex'?'none':'flex'">☰</button>
      </div>
    </nav>`;
  };

  const isActive = (page) => {
    const path = window.location.pathname;
    return path.includes(page) ? 'class="active"' : '';
  };

  // ── RENDER ITEM CARD ──
  const renderItemCard = (item, onClick) => {
    const icon = getCategoryIcon(item.category);
    return `
    <div class="item-card" data-id="${item.id}" onclick="${onClick || `UI.openItemDetail('${item.id}')`}">
      <div class="item-card-image">
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : `<span>${icon}</span>`}
      </div>
      <div class="item-card-body">
        <div class="item-card-meta">
          <span class="badge badge-${item.type}">${item.type}</span>
          <span class="badge badge-${item.status}">${item.status}</span>
        </div>
        <div class="item-card-title">${item.title}</div>
        <div class="item-card-desc">${item.description}</div>
        <div class="item-card-footer">
          <span class="item-card-location">📍 ${item.location}</span>
          <span class="item-card-date">${formatDate(item.date)}</span>
        </div>
      </div>
    </div>`;
  };

  // ── ITEM DETAIL MODAL ──
  const openItemDetail = (itemId) => {
    const item = DB.getById('items', itemId);
    if (!item) return;
    const session = DB.getSession();
    const reporter = DB.getById('users', item.reportedBy);
    const matchItem = item.matchId ? DB.getById('items', item.matchId) : null;

    let modalEl = document.getElementById('item-detail-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'item-detail-modal';
      modalEl.className = 'modal-overlay';
      document.body.appendChild(modalEl);
    }
    modalEl.innerHTML = `
    <div class="modal" style="max-width:640px">
      <div class="modal-header">
        <div>
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <span class="badge badge-${item.type}">${item.type}</span>
            <span class="badge badge-${item.status}">${item.status}</span>
          </div>
          <h2>${item.title}</h2>
        </div>
        <button class="modal-close">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:${item.image ? '1fr 1fr' : '1fr'};gap:16px;margin-bottom:20px">
        ${item.image ? `<img src="${item.image}" style="width:100%;border-radius:var(--radius);object-fit:cover;max-height:200px">` : ''}
        <div>
          <div class="form-group" style="margin:0">
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px">Category</div>
            <div style="font-weight:600">${getCategoryIcon(item.category)} ${item.category}</div>
          </div>
          <div class="divider"></div>
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px">Location</div>
          <div style="font-weight:600">📍 ${item.location}</div>
          <div class="divider"></div>
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px">Date</div>
          <div style="font-weight:600">📅 ${formatDate(item.date)}</div>
          <div class="divider"></div>
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px">Reported by</div>
          <div style="font-weight:600">👤 ${reporter?.name || 'Unknown'}</div>
        </div>
      </div>
      <div style="margin-bottom:20px">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px">Description</div>
        <p style="color:var(--text);font-size:14px;line-height:1.7">${item.description}</p>
      </div>
      ${item.tags?.length ? `
        <div style="margin-bottom:20px">
          <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">Tags</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${item.tags.map(t => `<span style="background:var(--surface2);padding:3px 10px;border-radius:40px;font-size:12px">#${t}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      ${matchItem ? `
        <div style="margin-bottom:20px">
          <div style="font-size:13px;color:var(--matched);font-weight:700;margin-bottom:8px">🔗 Possible Match Found</div>
          <div class="match-card">
            <div class="match-score">${DB.getMatchScore(item, matchItem)}%</div>
            <div>
              <div style="font-weight:700">${matchItem.title}</div>
              <div style="font-size:13px;color:var(--text-muted)">${matchItem.location} · ${formatDate(matchItem.date)}</div>
              <button class="btn btn-sm btn-ghost" style="margin-top:8px" onclick="UI.openItemDetail('${matchItem.id}')">View Match →</button>
            </div>
          </div>
        </div>
      ` : ''}
      ${session && item.status === 'found' && session.id !== item.reportedBy ? `
        <div class="divider"></div>
        <div>
          <button class="btn btn-primary w-full" onclick="UI.openClaimModal('${item.id}')">
            📋 Claim This Item
          </button>
          <p style="font-size:12px;text-align:center;margin-top:8px">You'll need to provide proof of ownership</p>
        </div>
      ` : ''}
    </div>`;
    openModal('item-detail-modal');
  };

  // ── CLAIM MODAL ──
  const openClaimModal = (itemId) => {
    closeAllModals();
    const session = DB.getSession();
    if (!session) { toast('Please login to claim items', 'error'); window.location.href = 'auth.html'; return; }
    let el = document.getElementById('claim-modal');
    if (!el) { el = document.createElement('div'); el.id = 'claim-modal'; el.className = 'modal-overlay'; document.body.appendChild(el); }
    el.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div><h3>Claim Item</h3><p style="margin:0;font-size:13px">Provide proof of ownership to proceed</p></div>
        <button class="modal-close">✕</button>
      </div>
      <div class="form-group">
        <label class="form-label">Describe your item (unique details)</label>
        <textarea class="form-control" id="claim-desc" placeholder="e.g. My phone has a photo of my dog as wallpaper, and there's a scratch on the top-left corner..." rows="4"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Upload Proof (optional)</label>
        <div class="upload-zone" id="claim-upload-zone">
          <input type="file" accept="image/*">
          <div class="upload-icon">📎</div>
          <div class="upload-text">Upload receipt, photo, or other proof</div>
          <div class="upload-preview"></div>
        </div>
      </div>
      <button class="btn btn-primary w-full" onclick="UI.submitClaim('${itemId}')">Submit Claim Request</button>
    </div>`;
    initUploadZone(document.getElementById('claim-upload-zone'));
    openModal('claim-modal');
  };

  const submitClaim = (itemId) => {
    const desc = document.getElementById('claim-desc')?.value.trim();
    if (!desc) { toast('Please describe the item to verify your claim', 'error'); return; }
    DB.updateRecord('items', itemId, { status: 'claimed', claimDesc: desc });
    DB.addLog('Claim Submitted', `Claim submitted for item ${itemId}`, DB.getSession()?.id);
    closeAllModals();
    toast('Claim submitted! Admin will verify and contact you.', 'success');
  };

  // ── CATEGORY ICONS ──
  const getCategoryIcon = (cat) => {
    const icons = {
      'Electronics': '📱', 'Wallet/Purse': '👜', 'ID/Cards': '🪪',
      'Keys': '🔑', 'Bag/Backpack': '🎒', 'Clothing': '👕',
      'Jewelry': '💍', 'Documents': '📄', 'Eyewear': '👓', 'Others': '📦'
    };
    return icons[cat] || '📦';
  };

  // ── DATE FORMATTING ──
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  // ── TEXT HIGHLIGHT ──
  const highlight = (text, query) => {
    if (!query) return text;
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<mark style="background:rgba(245,166,35,0.3);color:inherit;border-radius:2px">$1</mark>');
  };

  // ── INIT NAVBAR ──
  const mountNavbar = () => {
    const el = document.getElementById('navbar-mount');
    if (el) el.innerHTML = renderNavbar();
  };

  // ── REQUIRE AUTH ──
  const requireAuth = (role) => {
    const session = DB.getSession();
    if (!session) { window.location.href = 'auth.html'; return null; }
    if (role && session.role !== role) { toast('Access denied', 'error'); window.location.href = 'index.html'; return null; }
    return session;
  };

  // ── ANALYTICS CHART (pure canvas) ──
  const drawBarChart = (canvasId, labels, data, color = '#f5a623') => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const max = Math.max(...data, 1);
    const barW = (W - 60) / data.length - 10;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#141720';
    ctx.fillRect(0, 0, W, H);
    data.forEach((val, i) => {
      const x = 40 + i * ((W - 60) / data.length);
      const barH = ((val / max) * (H - 60));
      const y = H - 30 - barH;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 4);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#8892a4';
      ctx.font = '11px DM Sans';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, H - 8);
      ctx.fillStyle = '#eef0f6';
      ctx.fillText(val, x + barW / 2, y - 6);
    });
  };

  return { toast, openModal, closeModal, closeAllModals, initTabs, initFilterChips, initUploadZone, initSearch, renderNavbar, mountNavbar, renderItemCard, openItemDetail, openClaimModal, submitClaim, getCategoryIcon, formatDate, timeAgo, highlight, requireAuth, drawBarChart };
})();
