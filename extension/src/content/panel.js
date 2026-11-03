(() => {
  const PANEL_ID = 'mute-your-part-panel';
  const STORAGE_KEY = 'roleId';
  const MAX_ATTEMPTS = 40;
  const RETRY_MS = 250;
  const { ROLES, findRole } = globalThis.MuteYourPartParts;

  let retryTimer = null;
  let selectedRoleId = null;

  const isWatchPage = () => location.pathname === '/watch';

  const statusText = () => {
    const role = findRole(selectedRoleId);
    return role
      ? `${role.label} selected. Audio muting is not available yet.`
      : 'Choose your part.';
  };

  const refreshPanel = (panel) => {
    for (const button of panel.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.role === selectedRoleId));
    }
    panel.querySelector('.mute-your-part-status').textContent = statusText();
  };

  const selectRole = async (roleId, panel) => {
    selectedRoleId = selectedRoleId === roleId ? null : roleId;
    refreshPanel(panel);
    try {
      await chrome.storage.sync.set({ [STORAGE_KEY]: selectedRoleId });
    } catch (error) {
      console.warn('[Mute Your Part] Could not save your part.', error);
    }
  };

  const createPanel = () => {
    const panel = document.createElement('section');
    panel.id = PANEL_ID;
    panel.setAttribute('aria-label', 'Mute Your Part');

    const title = document.createElement('h2');
    title.textContent = 'Mute Your Part';

    const roles = document.createElement('div');
    roles.className = 'mute-your-part-roles';
    for (const role of ROLES) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.role = role.id;
      button.textContent = role.label;
      button.addEventListener('click', () => selectRole(role.id, panel));
      roles.append(button);
    }

    const status = document.createElement('p');
    status.className = 'mute-your-part-status';
    status.setAttribute('role', 'status');

    panel.append(title, roles, status);
    refreshPanel(panel);
    return panel;
  };

  const syncPanel = (attempt = 0) => {
    clearTimeout(retryTimer);
    const existing = document.getElementById(PANEL_ID);

    if (!isWatchPage()) {
      existing?.remove();
      return;
    }
    if (existing) return;

    const anchor = document.querySelector('ytd-watch-flexy #below');
    if (anchor) {
      anchor.prepend(createPanel());
    } else if (attempt < MAX_ATTEMPTS) {
      retryTimer = setTimeout(() => syncPanel(attempt + 1), RETRY_MS);
    }
  };

  const start = async () => {
    try {
      const stored = await chrome.storage.sync.get(STORAGE_KEY);
      selectedRoleId = findRole(stored[STORAGE_KEY])?.id ?? null;
    } catch (error) {
      console.warn('[Mute Your Part] Could not load your part.', error);
    }
    document.addEventListener('yt-navigate-finish', () => syncPanel());
    syncPanel();
  };

  start();
})();
