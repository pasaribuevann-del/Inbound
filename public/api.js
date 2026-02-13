// ========================================
// API Integration Layer
// ========================================
// This module provides API communication with the Laravel backend.
// Falls back to localStorage when API is not available.

const API_BASE = '/api';

// Map localStorage keys to API endpoints
const API_ENDPOINTS = {
    'inbound_arrivals': 'arrivals',
    'inbound_transactions': 'transactions',
    'inbound_vas': 'vas'
};

// Map frontend camelCase fields to API snake_case (and vice versa)
const FIELD_MAP = {
    arrivals: {
        toApi: { arrivalTime: 'arrival_time', receiptNo: 'receipt_no', poNo: 'po_no', poQty: 'po_qty' },
        fromApi: { arrival_time: 'arrivalTime', receipt_no: 'receiptNo', po_no: 'poNo', po_qty: 'poQty' }
    },
    transactions: {
        toApi: { timeTransaction: 'time_transaction', receiptNo: 'receipt_no', operateType: 'operate_type' },
        fromApi: { time_transaction: 'timeTransaction', receipt_no: 'receiptNo', operate_type: 'operateType' }
    },
    vas: {
        toApi: { startTime: 'start_time', endTime: 'end_time', vasType: 'vas_type' },
        fromApi: { start_time: 'startTime', end_time: 'endTime', vas_type: 'vasType' }
    }
};

// --- API availability check ---
let _apiAvailable = null; // null = not checked, true/false = cached result

async function checkApiAvailability() {
    try {
        const res = await fetch(`${API_BASE}/arrivals`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(2000)
        });
        _apiAvailable = res.ok;
    } catch {
        _apiAvailable = false;
    }
    return _apiAvailable;
}

function isApiAvailable() {
    return _apiAvailable === true;
}

// --- Field transformation ---
function transformToApi(endpoint, obj) {
    const map = FIELD_MAP[endpoint]?.toApi || {};
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (key === 'id' || key === 'createdAt') continue; // skip frontend-only fields
        const apiKey = map[key] || key;
        result[apiKey] = value;
    }
    return result;
}

function transformFromApi(endpoint, obj) {
    const map = FIELD_MAP[endpoint]?.fromApi || {};
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const feKey = map[key] || key;
        result[feKey] = value;
    }
    // Map 'id' from API (numeric) to string for frontend compatibility
    if (result.id !== undefined) result.id = String(result.id);
    return result;
}

// --- Core API functions ---
async function apiGet(storageKey) {
    const endpoint = API_ENDPOINTS[storageKey];
    if (!endpoint) return null;

    try {
        const res = await fetch(`${API_BASE}/${endpoint}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.map(item => transformFromApi(endpoint, item));
    } catch (err) {
        console.warn(`API GET /${endpoint} failed:`, err.message);
        return null;
    }
}

async function apiPost(storageKey, itemData) {
    const endpoint = API_ENDPOINTS[storageKey];
    if (!endpoint) return null;

    try {
        const body = transformToApi(endpoint, itemData);
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const created = await res.json();
        return transformFromApi(endpoint, created);
    } catch (err) {
        console.warn(`API POST /${endpoint} failed:`, err.message);
        return null;
    }
}

async function apiPut(storageKey, id, itemData) {
    const endpoint = API_ENDPOINTS[storageKey];
    if (!endpoint) return null;

    try {
        const body = transformToApi(endpoint, itemData);
        const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updated = await res.json();
        return transformFromApi(endpoint, updated);
    } catch (err) {
        console.warn(`API PUT /${endpoint}/${id} failed:`, err.message);
        return null;
    }
}

async function apiDelete(storageKey, id) {
    const endpoint = API_ENDPOINTS[storageKey];
    if (!endpoint) return false;

    try {
        const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
    } catch (err) {
        console.warn(`API DELETE /${endpoint}/${id} failed:`, err.message);
        return false;
    }
}

async function apiBulkDelete(storageKey, ids) {
    const endpoint = API_ENDPOINTS[storageKey];
    if (!endpoint) return false;

    try {
        const res = await fetch(`${API_BASE}/${endpoint}/bulk-delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ ids })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
    } catch (err) {
        console.warn(`API BULK DELETE /${endpoint} failed:`, err.message);
        return false;
    }
}

// --- Sync helpers ---
// getData with API: tries API first, falls back to localStorage
async function getDataAsync(key) {
    if (isApiAvailable()) {
        const apiData = await apiGet(key);
        if (apiData !== null) {
            // Also cache to localStorage as backup
            try { localStorage.setItem(key, JSON.stringify(apiData)); } catch { }
            return apiData;
        }
    }
    // Fallback to localStorage
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch { return []; }
}

// setData with API: saves to API and localStorage
async function setDataAsync(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    // Note: bulk overwrite is not typical for API;
    // individual CRUD operations handle API sync.
}

// --- Init: check API on load ---
async function initApiLayer() {
    await checkApiAvailability();
    const status = isApiAvailable() ? '🟢 Connected' : '🔴 Offline (using localStorage)';
    console.log(`[API] ${status} — ${API_BASE}`);

    // Show connection status indicator
    showApiStatus(isApiAvailable());
}

function showApiStatus(connected) {
    let indicator = document.getElementById('apiStatusIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'apiStatusIndicator';
        indicator.style.cssText = `
            position: fixed; bottom: 16px; right: 16px; z-index: 9999;
            padding: 8px 16px; border-radius: 24px; font-size: 12px;
            font-family: 'Inter', sans-serif; font-weight: 600;
            display: flex; align-items: center; gap: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: opacity 0.3s; cursor: pointer;
        `;
        indicator.onclick = () => { indicator.style.opacity = '0'; setTimeout(() => indicator.remove(), 300); };
        document.body.appendChild(indicator);
    }

    if (connected) {
        indicator.style.background = 'linear-gradient(135deg, #065f46, #047857)';
        indicator.style.color = '#d1fae5';
        indicator.innerHTML = '<span style="width:8px;height:8px;background:#34d399;border-radius:50%;display:inline-block;"></span> API Connected';
    } else {
        indicator.style.background = 'linear-gradient(135deg, #7f1d1d, #991b1b)';
        indicator.style.color = '#fecaca';
        indicator.innerHTML = '<span style="width:8px;height:8px;background:#f87171;border-radius:50%;display:inline-block;"></span> Offline Mode';
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (indicator) { indicator.style.opacity = '0'; setTimeout(() => indicator.remove(), 300); }
    }, 5000);
}
