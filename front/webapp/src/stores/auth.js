import http from '@/libs/http';
import ls from 'localstorage-slim';
import { defineStore } from 'pinia';
import { usePostStore } from './post';
import { useWsStore } from './ws';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
  }),
  actions: {
    async me() {
      try {
        const { data } = await http.get('/auth/me', {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        this.user = data;
        return this.user;
      } catch (error) {
        return false;
      }
    },
    async login(credentials) {
      const messages = {
        invalid_username: 'Algún dato no es correcto',
        invalid_password: 'Algún dato no es correcto',
      };
      try {
        const { data } = await http.post('/auth/login', credentials);
        ls.set('access_token', data.access_token);
        this.user = data;
        return true;
      } catch (error) {
        return messages[error.response.data.error] || 'unauthorized';
      }
    },
    async logout() {
      const postStore = usePostStore();

      const wsStore = useWsStore();
      const authStore = useAuthStore();

      try {
        await http.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        postStore.$reset();
        wsStore.reset();
        authStore.$reset();

        ls.remove('access_token');
        this.user = null;
      } catch (error) {
       console.error(error);
      }
    },
    async password(credentials) {
      try {
        const { data } = await http.post('/auth/password', credentials, {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
  getters: {}
});
