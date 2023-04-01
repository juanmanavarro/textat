import http from '@/libs/http';
import ls from 'localstorage-slim';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    users: [],
    selected: {},
  }),
  actions: {
    async fetch() {
      try {
        const { data } = await http.get(`/dashboard/users`, {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        this.users = data;
        this.selected = this.users[0];
      } catch (error) {

      }
    },
    async contact(id, response) {
      const runtimeConfig = useRuntimeConfig();
      const authStore = useAuthStore();
      try {
        const { data } = await http.put(`/dashboard/contacts/${id}`, {
          admin_id: authStore.admin.id,
          response,
        }, {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        const contactIndex = this.selected.contacts
          ?.findIndex(c => c.id === data.contact.id);
        if ( contactIndex === -1 ) return;
        this.selected.contacts[contactIndex] = data.contact;
      } catch (error) {

      }
    }
  },
  getters: {}
});
