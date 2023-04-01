import http from '@/libs/http';
import { useAuthStore } from '@/stores/auth';
import ls from 'localstorage-slim';
import { defineStore } from 'pinia';
import { useWsStore } from './ws';
import { usePostStore } from './post';

export const useCategoryStore = defineStore({
  id: 'category',
  state: () => ({
    loading: false,
    categories: [],
  }),
  actions: {
    init() {
      const wsStore = useWsStore();
      const postStore = usePostStore();

      wsStore.socket.on('category:created', () => this.fetch(true));
      wsStore.socket.on('category:deleted', () => postStore.fetch(true));
    },
    async fetch(force = false) {
      if ( this.categories.length && !force ) return;
      try {
        const { data: categories } = await http.get('/categories', {
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });
        this.categories = categories;
      } catch (error) {
        console.error(error);
      }
    },
    async edit(category) {
      try {
        const { data: edited } = await http.put(`/categories/${category.id}`, category, {
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });
        if ( !edited ) return false;
        let index = this.categories.findIndex(p => p.id === category.id );
        if ( index !== -1 )
        this.categories[index] = edited;
        return edited;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async remove(category) {
      try {
        const { data: id } = await http.delete(`/categories/${category.id}`, {
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });
        const categoryIndex = this.categories.findIndex(c => c.id === id);
        if ( categoryIndex === -1 ) throw new Error('Deleted category not found');
        this.categories.splice(categoryIndex, 1);
        return id;
      } catch (error) {
        console.error(error);
      }
    },
    // async create(message) {
    //   try {
    //     const { data: created } = await http.post('/messages', message, {
    //       headers: { Authorization: `Bearer ${ls.get('access_token') }`},
    //     });
    //     if ( !created ) return false;
    //     this.messages.push(created);
    //     return created;
    //   } catch (error) {
    //     return false;
    //   }
    // },
  },
  getters: {
    sorted() {
      return this.categories.sort((a, b) => {
        if ( a.post_count > b.post_count ) return -1;
        if ( a.post_count < b.post_count ) return 1;
        return 0;
      });
    },
  },
});
