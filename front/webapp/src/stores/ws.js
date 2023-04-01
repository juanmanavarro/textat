import { usePostStore } from '@/stores/post';
import ls from 'localstorage-slim';
import { defineStore } from 'pinia';
import io from 'socket.io-client';
import { useAuthStore } from './auth';
import { useBillingStore } from './billing';

export const useWsStore = defineStore({
  id: 'websocket',
  state: () => ({
    socket: null,
    status: 'ws:disconnected',
  }),
  actions: {
    async init() {
      const authStore     = useAuthStore();
      const postStore     = usePostStore();
      const billingStore  = useBillingStore();

      const socket = io(import.meta.env.VITE_WS_HOST, {
        path: import.meta.env.VITE_WS_PATH,
        auth: {
          token: ls.get('access_token'),
          user_id: authStore.user?.id,
        },
      });

      this.socket = socket;

      billingStore.init();
      postStore.init();

      socket.on('connect', () => {
        socket.emit('authorization');
        this.status = 'ws:connected';
      });

      socket.on('auth', (authed) => {
        this.status = authed;
      });

      socket.on('exception', (data) => {
        this.status = 'ws:exception';
      });

      socket.on('ws:disconnected', () => {
        if ( this.socket ) this.socket.disconnect();
        this.status = 'ws:disconnected';
      });

      socket.on('error', () => {
        this.status = 'ws:error';
      });
    },
    reset() {
      this.socket?.emit('forceDisconnect');
      this.status = 'ws:disconnected';
      this.socket = null;
    },
  },
  getters: {},
});
