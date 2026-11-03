/**
 * CAFE JUANA - ADMIN DASHBOARD SCRIPT
 * Handles sidebar toggling, search empty-state modal, filters, and notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('dashSidebar');
  const mainWrapper = document.getElementById('dashMainWrapper');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  
  const searchInput = document.getElementById('globalSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchModal = document.getElementById('searchModal');
  const modalClearBtn = document.getElementById('modalClearBtn');

  // 1. Sidebar Collapse / Expand Toggle
  if (toggleBtn && sidebar && mainWrapper) {
    // Restore user preference
    const isCollapsed = localStorage.getItem('juana_sidebar_collapsed') === 'true';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
      mainWrapper.classList.add('expanded');
    }

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainWrapper.classList.toggle('expanded');
      const state = sidebar.classList.contains('collapsed');
      localStorage.setItem('juana_sidebar_collapsed', state);
    });
  }

  // 2. Interactive Search & Empty State Modal (Figma design showcase)
  if (searchInput && searchModal) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (searchClearBtn) {
        searchClearBtn.style.display = query.length > 0 ? 'flex' : 'none';
      }

      // If user types query with no match (e.g. unknown customer or > 2 chars)
      if (query.toLowerCase().includes('unknown') || query.length >= 3) {
        searchModal.classList.add('show');
      } else {
        searchModal.classList.remove('show');
      }
    });

    const clearSearch = () => {
      searchInput.value = '';
      searchModal.classList.remove('show');
      if (searchClearBtn) searchClearBtn.style.display = 'none';
      searchInput.focus();
    };

    if (searchClearBtn) searchClearBtn.addEventListener('click', clearSearch);
    if (modalClearBtn) modalClearBtn.addEventListener('click', clearSearch);

    // Close search modal when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchModal.contains(e.target)) {
        searchModal.classList.remove('show');
      }
    });
  }

  // 3. Navigation Active Item Switcher
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
});
