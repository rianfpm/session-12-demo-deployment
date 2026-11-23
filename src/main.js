/**
 * Task Ledger Pro - Vite 8 + Tailwind CSS v4 Edition (BNI Light Mode)
 * Production-Ready Vanilla JS Module
 * BNI ODP IT 2026 - Deployment Demonstration
 */

import './style.css';

const STORAGE_KEY = 'bni_vite_tailwind_todos_v1';

// State
let todos = [];
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const itemsLeftCount = document.getElementById('itemsLeftCount');
const countAll = document.getElementById('countAll');
const countActive = document.getElementById('countActive');
const countCompleted = document.getElementById('countCompleted');
const btnClearCompleted = document.getElementById('btnClearCompleted');
const tabButtons = document.querySelectorAll('.tab-btn');

/**
 * Memuat daftar tugas dari LocalStorage
 */
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        todos = parsed;
        return;
      }
    }
  } catch (e) {
    console.warn('[Task Ledger Pro] Gagal membaca storage, menggunakan data default.', e);
  }

  // Data awal BNI operational tasks
  todos = [
    { id: 'v-' + Date.now() + '-1', text: 'Verifikasi pipeline build Vite 8.x & Tailwind CSS v4', completed: true, priority: 'urgent', createdAt: Date.now() - 7200000 },
    { id: 'v-' + Date.now() + '-2', text: 'Konfigurasi Multi-stage Dockerfile untuk runtime Nginx Alpine', completed: true, priority: 'high', createdAt: Date.now() - 3600000 },
    { id: 'v-' + Date.now() + '-3', text: 'Integrasi brand color BNI Teal (#005E6A) dan BNI Orange (#F15A23)', completed: false, priority: 'high', createdAt: Date.now() - 1800000 },
    { id: 'v-' + Date.now() + '-4', text: 'Smoke test deployment SPA fallback pada Nginx & Netlify', completed: false, priority: 'normal', createdAt: Date.now() }
  ];
  saveTodos();
}

/**
 * Menyimpan daftar tugas ke LocalStorage
 */
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error('[Task Ledger Pro] Gagal menyimpan ke storage:', e);
  }
}

/**
 * Menambahkan tugas baru
 * @param {string} text
 * @param {'normal' | 'high' | 'urgent'} priority
 */
function addTodo(text, priority = 'normal') {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newTodo = {
    id: 'v-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    text: trimmed,
    completed: false,
    priority,
    createdAt: Date.now()
  };

  todos.unshift(newTodo);
  saveTodos();
  render();
}

/**
 * Mengubah status selesai tugas
 * @param {string} id
 */
function toggleTodo(id) {
  todos = todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTodos();
  render();
}

/**
 * Menghapus tugas berdasarkan ID
 * @param {string} id
 */
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

/**
 * Membersihkan tugas yang sudah selesai
 */
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  render();
}

/**
 * Mendapatkan tugas yang sudah terfilter
 */
function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter(t => !t.completed);
  if (currentFilter === 'completed') return todos.filter(t => t.completed);
  return todos;
}

/**
 * Mendapatkan badge prioritas berbasis warna resmi BNI
 */
function getPriorityBadgeHtml(priority) {
  if (priority === 'urgent') {
    return `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Mendesak</span>`;
  }
  if (priority === 'high') {
    return `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FFF4EE] text-[#F15A23] border border-[#F15A23]/30">BNI Prioritas</span>`;
  }
  return `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F0F7F8] text-[#005E6A] border border-[#005E6A]/20">Normal</span>`;
}

/**
 * Render antarmuka ke DOM (Light Theme)
 */
function render() {
  const filtered = getFilteredTodos();
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  // Counter badges
  countAll.textContent = todos.length;
  countActive.textContent = activeCount;
  countCompleted.textContent = completedCount;
  itemsLeftCount.textContent = activeCount;

  btnClearCompleted.disabled = completedCount === 0;

  // Render items
  todoList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    filtered.forEach(todo => {
      const li = document.createElement('li');
      li.className = `p-4 flex items-center justify-between gap-3 group transition border-b border-slate-100 last:border-b-0 ${
        todo.completed ? 'bg-slate-50/70' : 'hover:bg-[#F0F7F8]/40'
      }`;

      // Left area (checkbox, text, priority)
      const leftDiv = document.createElement('div');
      leftDiv.className = 'flex items-center gap-3 min-w-0 flex-1';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.className = 'w-4 h-4 rounded border-slate-300 text-[#005E6A] focus:ring-[#005E6A] focus:ring-offset-white cursor-pointer transition';
      checkbox.style.accentColor = '#005E6A';
      checkbox.addEventListener('change', () => toggleTodo(todo.id));

      const textWrapper = document.createElement('div');
      textWrapper.className = 'flex items-center gap-2 flex-wrap min-w-0';

      const textSpan = document.createElement('span');
      textSpan.className = `text-sm break-words transition ${
        todo.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'
      }`;
      textSpan.textContent = todo.text;

      textWrapper.appendChild(textSpan);
      textWrapper.insertAdjacentHTML('beforeend', getPriorityBadgeHtml(todo.priority));

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(textWrapper);

      // Right area (delete button)
      const btnDelete = document.createElement('button');
      btnDelete.type = 'button';
      btnDelete.className = 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition opacity-70 group-hover:opacity-100 cursor-pointer';
      btnDelete.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      `;
      btnDelete.setAttribute('aria-label', `Hapus tugas ${todo.text}`);
      btnDelete.title = 'Hapus tugas';
      btnDelete.addEventListener('click', () => deleteTodo(todo.id));

      li.appendChild(leftDiv);
      li.appendChild(btnDelete);
      todoList.appendChild(li);
    });
  }
}

// Event Listeners
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value, prioritySelect.value);
  todoInput.value = '';
  todoInput.focus();
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => {
      b.className = 'tab-btn px-3 py-1.5 rounded-md font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition border border-transparent cursor-pointer';
      const badge = b.querySelector('span');
      if (badge) badge.className = 'ml-1 px-1.5 py-0.5 rounded-full bg-slate-200 text-[10px] text-slate-600 font-mono';
    });

    btn.className = 'tab-btn px-3 py-1.5 rounded-md font-medium text-white bg-[#005E6A] border border-[#005E6A] transition shadow-xs cursor-pointer';
    const activeBadge = btn.querySelector('span');
    if (activeBadge) activeBadge.className = 'ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] text-white font-mono';

    currentFilter = btn.getAttribute('data-filter') || 'all';
    render();
  });
});

btnClearCompleted.addEventListener('click', () => {
  clearCompleted();
});

// Bootstrapping
loadTodos();
render();
