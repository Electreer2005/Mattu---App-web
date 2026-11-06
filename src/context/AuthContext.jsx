import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'mattu.users';
const SESSION_KEY = 'mattu.session';

/* ─────────── Usuario demo precargado ─────────── */
const DEMO_USER = {
  id: 'demo-001',
  name: 'Juan Doe',
  email: 'demo@mattu.com',
  password: '123456',
  role: 'customer',
  avatar: null,
  createdAt: '2026-01-15T00:00:00.000Z',
};

/* ─────────── Admin demo ─────────── */
const DEMO_ADMIN = {
  id: 'admin-001',
  name: 'Admin Mattu',
  email: 'admin@mattu.com',
  password: 'admin123',
  role: 'admin',
  avatar: null,
  createdAt: '2026-01-01T00:00:00.000Z',
};

const SEED_USERS = [DEMO_USER, DEMO_ADMIN];

/* ─────────── Storage helpers ─────────── */
function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);

    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      return [...SEED_USERS];
    }

    const parsed = JSON.parse(raw);
    let mutated = false;

    // Asegura que ambos seeds existan, sin pisar al usuario si ya existe
    for (const seed of SEED_USERS) {
      if (!parsed.some((u) => u.email === seed.email)) {
        parsed.push(seed);
        mutated = true;
      }
    }

    if (mutated) localStorage.setItem(USERS_KEY, JSON.stringify(parsed));
    return parsed;
  } catch {
    return [...SEED_USERS];
  }
}

function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    // Cuota excedida (localStorage ~5MB). Muy probable si suben avatares enormes.
    console.error('No se pudo guardar usuarios:', err);
    throw new Error(
      'No se pudo guardar la información. Probá con una imagen más chica.'
    );
  }
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(user) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}

function sanitize(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

/* ─────────── Resize de imagen a data URL ─────────── */
function resizeImage(file, maxSize = 256) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen.'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('La imagen no puede superar 5 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('La imagen está corrupta o no es válida.'));
      img.onload = () => {
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════════════════
   PROVIDER
   ═══════════════════════════════════════════════════════ */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    readUsers(); // siembra admin y customer si faltan
    const session = readSession();
    if (session) setUser(session);
    setIsBootstrapping(false);
  }, []);

  /* ─────────── login ─────────── */
  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      await delay();
      const users = readUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!found) throw new Error('No existe una cuenta con ese email.');
      if (found.password !== password) throw new Error('Contraseña incorrecta.');
      const safe = sanitize(found);
      setUser(safe);
      writeSession(safe);
      return safe;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ─────────── register ─────────── */
  const register = useCallback(async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      await delay();
      const users = readUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (exists) throw new Error('Ya existe una cuenta con ese email.');
      if (password.length < 6)
        throw new Error('La contraseña debe tener al menos 6 caracteres.');

      const newUser = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'customer',
        avatar: null,
        createdAt: new Date().toISOString(),
      };
      writeUsers([...users, newUser]);
      const safe = sanitize(newUser);
      setUser(safe);
      writeSession(safe);
      return safe;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ─────────── logout ─────────── */
  const logout = useCallback(() => {
    setUser(null);
    writeSession(null);
  }, []);

  /* ─────────── forgotPassword ─────────── */
  const forgotPassword = useCallback(async (email) => {
    setIsLoading(true);
    try {
      await delay();
      const users = readUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      return { ok: true, email: email.trim().toLowerCase(), exists };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ─────────── resetPassword ─────────── */
  const resetPassword = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      await delay();
      const users = readUsers();
      const idx = users.findIndex(
        (u) => u.email.toLowerCase() === email?.trim().toLowerCase()
      );
      if (idx === -1) throw new Error('No se encontró la cuenta.');
      if (password.length < 6)
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      const updated = { ...users[idx], password };
      users[idx] = updated;
      writeUsers(users);
      return sanitize(updated);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ─────────── updateProfile ─────────── */
  const updateProfile = useCallback(
    async (patch) => {
      if (!user) throw new Error('No hay sesión activa.');
      setIsLoading(true);
      try {
        await delay(500);
        const users = readUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx === -1) throw new Error('Usuario no encontrado.');

        // Nunca permitir sobrescribir password desde updateProfile
        const { password: _ignored, ...safePatch } = patch;

        const updated = { ...users[idx], ...safePatch };
        users[idx] = updated;
        writeUsers(users);
        const safe = sanitize(updated);
        setUser(safe);
        writeSession(safe);
        return safe;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  /* ─────────── updateAvatar ─────────── */
  const updateAvatar = useCallback(
    async (file) => {
      if (!user) throw new Error('No hay sesión activa.');
      if (!file) throw new Error('No se envió ninguna imagen.');

      setIsLoading(true);
      try {
        // Procesa + redimensiona a data URL (~10-25 KB)
        const dataUrl = await resizeImage(file, 256);

        const users = readUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx === -1) throw new Error('Usuario no encontrado.');

        const updated = { ...users[idx], avatar: dataUrl };
        users[idx] = updated;
        writeUsers(users);

        const safe = sanitize(updated);
        setUser(safe);
        writeSession(safe);
        return safe;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  /* ─────────── removeAvatar ─────────── */
  const removeAvatar = useCallback(async () => {
    if (!user) throw new Error('No hay sesión activa.');
    setIsLoading(true);
    try {
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx === -1) throw new Error('Usuario no encontrado.');

      const { avatar: _removed, ...rest } = users[idx];
      users[idx] = rest;
      writeUsers(users);

      const safe = sanitize(rest);
      setUser(safe);
      writeSession(safe);
      return safe;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      isBootstrapping,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      updateProfile,
      updateAvatar,
      removeAvatar,
    }),
    [
      user,
      isLoading,
      isBootstrapping,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      updateProfile,
      updateAvatar,
      removeAvatar,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}