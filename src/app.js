(() => {
  'use strict';

  const API_URL = 'https://jsonplaceholder.typicode.com/users';

  const state = {
    loading: false,
    error: null,
    data: [],
  };

  let activeController = null;

  const els = {
    list: document.getElementById('list'),
    status: document.getElementById('status'),
    refreshBtn: document.getElementById('refreshBtn'),
  };

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[s]));
  }

  function setStatus(content, withSpinner = false) {
    const spinner = withSpinner ? '<span class="spinner" aria-hidden="true"></span>' : '';
    els.status.innerHTML = content ? `${spinner}<span>${content}</span>` : '';
  }

  function renderList(items) {
    els.list.innerHTML = '';

    if (!items || !items.length) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'No items found.';
      els.list.appendChild(li);
      return;
    }

    const frag = document.createDocumentFragment();
    items.forEach((user) => {
      const li = document.createElement('li');
      li.className = 'card';
      li.innerHTML = `
        <h3>${escapeHTML(user.name)}</h3>
        <p><strong>Username:</strong> ${escapeHTML(user.username)}</p>
        <p><strong>Email:</strong> <a href="mailto:${encodeURIComponent(user.email)}">${escapeHTML(user.email)}</a></p>
        <p><strong>Company:</strong> ${user.company ? escapeHTML(user.company.name) : '—'}</p>
        <p><strong>City:</strong> ${user.address ? escapeHTML(user.address.city) : '—'}</p>
      `;
      frag.appendChild(li);
    });
    els.list.appendChild(frag);
  }

  function render() {
    // Status
    if (state.loading) {
      setStatus('Loading items...', true);
      els.list.setAttribute('aria-busy', 'true');
    } else if (state.error) {
      const msg = escapeHTML(state.error.message || 'Something went wrong.');
      setStatus(`<span class="error">${msg}</span> <button id="retryBtn" class="btn">Retry</button>`);
      els.list.setAttribute('aria-busy', 'false');
      // Focus the retry button for accessibility
      queueMicrotask(() => {
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) retryBtn.focus();
      });
    } else {
      setStatus('');
      els.list.setAttribute('aria-busy', 'false');
    }

    // Controls
    els.refreshBtn.disabled = state.loading;

    // Content
    if (!state.loading && !state.error) {
      renderList(state.data);
    }
  }

  async function load() {
    // Cancel any in-flight request
    if (activeController) {
      activeController.abort();
    }
    const controller = new AbortController();
    activeController = controller;

    state.loading = true;
    state.error = null;
    render();

    try {
      const res = await fetch(API_URL, { signal: controller.signal });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Unexpected response format.');
      // Only update if this is the latest request
      if (activeController === controller) {
        state.data = data;
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was canceled by a newer request; do nothing
        return;
      }
      state.error = err;
      console.error(err);
    } finally {
      if (activeController === controller) {
        state.loading = false;
        render();
      }
    }
  }

  // Events
  els.refreshBtn.addEventListener('click', () => load());
  els.status.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'retryBtn') {
      load();
    }
  });

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    render();
    load();
  });
})();
