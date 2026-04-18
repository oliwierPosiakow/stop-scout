import { defineStore } from 'pinia';
import { dbPromise } from '../utils/db';
import type { User, AuthState } from '../types/user';

export const useUserStore = defineStore('user', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loginError: null,
    registerError: null,
  }),

  actions: {
    checkLocalSession() {
      const savedToken = localStorage.getItem('scout_token');
      const savedUser = localStorage.getItem('scout_user');
      if (savedToken && savedUser) {
        this.token = savedToken;
        this.user = JSON.parse(savedUser);
        this.isAuthenticated = true;
      }
    },

    async register(username: string, passwordRaw: string) {
      this.registerError = null;
      try {
        if (!username || username.length < 3) {
          throw new Error('Nazwa użytkownika musi mieć co najmniej 3 znaki');
        }
        if (!passwordRaw || passwordRaw.length < 6) {
          throw new Error('Hasło musi mieć co najmniej 6 znaków');
        }

        const db = await dbPromise;
        const existingUser = await db.get('users', username);
        if (existingUser) {
          throw new Error('Użytkownik o takiej nazwie już istnieje');
        }

        const newUser: User = {
          username,
          passwordHash: passwordRaw,
          passwordSalt: '',
          createdAt: Date.now(),
        };

        await db.put('users', newUser);
        return true;
      } catch (error: any) {
        this.registerError = error.message || 'Błąd podczas rejestracji';
        return false;
      }
    },

    async login(username: string, passwordRaw: string) {
      this.loginError = null;
      try {
        if (!username || !passwordRaw) {
          throw new Error('Podaj nazwę użytkownika i hasło');
        }

        const db = await dbPromise;
        const user: User | undefined = await db.get('users', username);
        if (!user) {
          throw new Error('Nieprawidłowa nazwa użytkownika lub hasło');
        }

        // Porównanie hasła w plain text
        if (passwordRaw !== user.passwordHash) {
          throw new Error('Nieprawidłowa nazwa użytkownika lub hasło');
        }

        this.user = user;
        this.isAuthenticated = true;
        this.token =
          btoa(JSON.stringify({ sub: username, time: Date.now() })) + '.dummy.signature';

        localStorage.setItem('scout_token', this.token);
        localStorage.setItem('scout_user', JSON.stringify({ username: user.username }));

        return true;
      } catch (error: any) {
        this.loginError = error.message || 'Błąd logowania';
        return false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('scout_token');
      localStorage.removeItem('scout_user');
    },
  },
});
