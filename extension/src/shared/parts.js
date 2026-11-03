// Runs as a classic content script and as a Node module in tests.
(() => {
  const STEMS = Object.freeze(['drums', 'bass', 'other', 'vocals', 'guitar', 'piano']);

  const ROLES = Object.freeze([
    Object.freeze({ id: 'singer', label: 'Singer', mutes: 'vocals' }),
    Object.freeze({ id: 'guitarist', label: 'Guitarist', mutes: 'guitar' }),
    Object.freeze({ id: 'bassist', label: 'Bassist', mutes: 'bass' }),
    Object.freeze({ id: 'drummer', label: 'Drummer', mutes: 'drums' }),
    Object.freeze({ id: 'keyboardist', label: 'Keyboardist', mutes: 'piano' }),
  ]);

  const findRole = (id) => ROLES.find((role) => role.id === id) ?? null;

  /** Returns a gain for each stem: 0 for the role's part and 1 for the rest. */
  const stemGains = (roleId) => {
    const muted = findRole(roleId)?.mutes;
    return Object.fromEntries(STEMS.map((stem) => [stem, stem === muted ? 0 : 1]));
  };

  globalThis.MuteYourPartParts = Object.freeze({ STEMS, ROLES, findRole, stemGains });
})();
