import http from '@/libs/http';
import ls from 'localstorage-slim';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    admin: null,
  }),
  actions: {
    async me() {
      try {
        const { data } = await http.get('/dashboard/auth/me', {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        this.admin = data.admin;
        return this.admin;
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
        const { data } = await http.post('/dashboard/auth/login', credentials);
        ls.set('access_token', data.access_token);
        this.admin = data;
        return true;
      } catch (error) {
        return messages[error.response.data.error] || 'unauthorized';
      }
    },
    async logout() {
      const authStore = useAuthStore();

      try {
        await http.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        authStore.$reset();

        ls.remove('access_token');
        this.admin = null;
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
