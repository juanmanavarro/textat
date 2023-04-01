import http from '@/libs/http';
import ls from 'localstorage-slim';
import { defineStore } from 'pinia';
import { useWsStore } from './ws';
import { usePostStore } from './post';

export const useTagStore = defineStore({
  id: 'tag',
  state: () => ({
    loading: false,
    tags: [],
  }),
  actions: {
    // init() {
    //   const wsStore = useWsStore();
    //   const postStore = usePostStore();

    //   wsStore.socket.on('category:created', () => this.fetch(true));
    //   wsStore.socket.on('category:deleted', () => postStore.fetch(true));
    // },
    async fetch(force = false) {
      if ( this.tags.length && !force ) return;
      try {
        const { data: tags } = await http.get('/tags', {
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });
        this.tags = tags;
      } catch (error) {
        console.error(error);
      }
    },
  },
  getters: {
    // sorted() {
    //   return this.categories.sort((a, b) => {
    //     if ( a.post_count > b.post_count ) return -1;
    //     if ( a.post_count < b.post_count ) return 1;
    //     return 0;
    //   });
    // },
  },
});
