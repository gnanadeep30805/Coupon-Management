(function () {
  const USERS_KEY = 'coupon-auth-users';
  const CURRENT_USER_KEY = 'coupon-current-user';

  function normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
  }

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (err) {
      console.warn('Failed to parse users from storage', err);
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function ensureSeedUser() {
    if (!localStorage.getItem(USERS_KEY)) {
      saveUsers([
        {
          name: 'Demo Admin',
          email: 'admin@coupon.io',
          password: 'admin123'
        }
      ]);
    }
  }

  function getSafeUser(user) {
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  }

  ensureSeedUser();

  const authStore = {
    signup({ name, email, password }) {
      const trimmedName = (name || '').trim();
      const normalizedEmail = normalizeEmail(email);
      if (!trimmedName || !normalizedEmail || !password) {
        throw new Error('All fields are required.');
      }

      const users = loadUsers();
      if (users.some((u) => u.email === normalizedEmail)) {
        throw new Error('Email already registered.');
      }

      users.push({ name: trimmedName, email: normalizedEmail, password });
      saveUsers(users);
      return getSafeUser({ name: trimmedName, email: normalizedEmail });
    },

    login({ email, password }) {
      const normalizedEmail = normalizeEmail(email);
      if (!normalizedEmail || !password) {
        throw new Error('Email and password are required.');
      }

      const users = loadUsers();
      const user = users.find((u) => u.email === normalizedEmail && u.password === password);
      if (!user) {
        throw new Error('Invalid email or password.');
      }

      const safeUser = getSafeUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      return safeUser;
    },

    logout() {
      localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser() {
      try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
      } catch (err) {
        console.warn('Failed to parse current user', err);
        return null;
      }
    },

    requireAuth(redirectPath = 'index.html') {
      if (!authStore.getCurrentUser()) {
        window.location.href = redirectPath;
      }
    }
  };

  window.authStore = authStore;
})();


