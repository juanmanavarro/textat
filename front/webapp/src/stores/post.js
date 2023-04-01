import http from '@/libs/http';
import ls from 'localstorage-slim';
import { defineStore } from 'pinia';
import { useWsStore } from './ws';

export const usePostStore = defineStore({
  id: 'post',
  state: () => ({
    loading: false,
    posts: [],
    dates: [],
    filter: {
      tags: [],
      reactions: [],
      types: [],
    },
    pagination: {},
    filterOptions: {
      tags: [],
      reactions: [],
      types: [],
    },
  }),
  actions: {
    init() {
      const wsStore = useWsStore();

      wsStore.socket.on('post:created', async ({ post }) => {
        this.posts.unshift({ ...post, is_new: true });
      });

      wsStore.socket.on('post:updated', async ({ post }) => {
        let index = this.posts.findIndex(p => p._id === post._id);
        if ( index === -1 ) return;
        this.posts[index] = post;
        this.fetchReactions();
      });

      wsStore.socket.on('tag:created', async ({ tag }) => {
        this.tags.push(tag);
      });
    },
    async reset() {
      this.posts = [];
      await this.fetch();
      this.loading = false;
    },
    async search(payload = {}) {
      this.loading = true;

      if ( !payload ) {
        this.resetFilter();
        this.reset();
        return;
      }

      Object.assign(this.filter, payload);
      this.reset();
    },
    async fetch() {
      if ( this.posts.length >= this.pagination?.total ) return;
      if ( this.posts.length && this.posts.length <= this.pagination?.skip ) return;

      try {
        const { data } = await http.get('/posts', {
          params: { ...this.filter, skip: this.posts.length },
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });

        this.pagination = { ...data.pagination, skip: this.posts.length };
        this.posts = this.posts.concat(data.posts);
        this.filterOptions = data.filter_options;
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    async edit(id, post) {
      try {
        const { data: edited } = await http.put(`/posts/${id}`, post, {
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });
        if ( !edited ) return false;
        let index = this.posts.findIndex(p => p.id === edited.id );
        if ( index !== -1 )
        this.posts[index] = edited;
        return edited;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async delete(post) {
      try {
        const { data: id } = await http.delete(`/posts/${post.id}`, {
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });
        const postIndex = this.posts.findIndex(m => m.id === id);
        if ( postIndex === -1 ) throw new Error('Deleted post not found');
        this.posts.splice(postIndex, 1);
        return id;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async fetchReactions() {
      try {
        const { data } = await http.get('/posts/reactions', {
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });

        this.filterOptions.reactions = data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchDates() {
      try {
        const { data } = await http.get('/posts/dates', {
          headers: { Authorization: `Bearer ${ls.get('access_token') }`},
        });

        this.dates = data;
      } catch (error) {
        console.error(error);
      }
    },
    resetFilter() {
      this.filter = {
        tags: [],
        categories: [],
        reactions: [],
        types: [],
      };
    },
  },
  getters: {
    isFilterActive() {
      return Object.keys(this.filter).some(k => {
        return Array.isArray(this.filter[k])
          ? this.filter[k].length
          : this.filter[k];
      });
    },
  },
});
