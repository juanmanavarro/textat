import http from '@/libs/http';
import ls from 'localstorage-slim';
import { defineStore } from 'pinia';
import { BigNumber } from 'bignumber.js';
import { useWsStore } from './ws';

export const useBillingStore = defineStore({
  id: 'billing',
  state: () => ({
    loading: false,
    status: null,
    prices: [],
    selected: null,
    subscription: null,
  }),
  actions: {
    init() {
      const wsStore = useWsStore();

      wsStore.socket.on('stripe:subscription', ({ subscription }) => {
        this.subscription = subscription;
        if ( this.loading ) this.loading = false;
      });
    },
    async fetch() {
      if ( this.subscription ) return;
      this.loading = true;
      try {
        const { data } = await http.get('/subscriptions', {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        this.subscription = data.subscription;
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    async create(payload) {
      this.loading = true;

      const body = {
        plan_id: this.selected.id,
        user: {
          id: payload.user.id,
          username: payload.user.username,
          registered_at: payload.user.registered_at,
        },
      };
      if ( payload.payment_method ) {
        body.payment_method_id = payload.payment_method.id;
      }

      try {
        const { data } = await http.post('/subscriptions', body, {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        this.loading = false;
        return true;
      } catch (error) {
        console.error(error);
        this.loading = false;
        return error.response.data;
      }
    },
    async update(cancel) {
      if ( !this.subscription ) return;
      if ( !this.loading ) this.loading = true;
      try {
        await http.put(
          `/subscriptions/${this.subscription.id}`,
          { cancel },
          { headers: { Authorization: `Bearer ${ls.get('access_token')}` } }
        );
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPrices() {
      if ( this.prices.length ) return;
      this.loading = true;
      try {
        const { data } = await http.get('/stripe/prices', {
          headers: { Authorization: `Bearer ${ls.get('access_token')}` },
        });
        this.prices = data.prices
          .filter(p => p.id !== 'price_1MY5pXJATOnjvNEMjXOYEbt1')
          .sort((a, b) => {
            if ( a.unit_amount < b.unit_amount ) return 1;
            if ( a.unit_amount > b.unit_amount ) return -1;
            return 0;
          });
        this.selected = this.prices[0];
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
  },
  getters: {
    subscriptionSavings() {
      const periods = this.prices[0]?.recurring.interval === 'week' ? 7 : 12;
      return new BigNumber(this.prices[0]?.unit_amount)
        .div(this.prices[1]?.unit_amount * periods)
        .minus(1)
        .multipliedBy(100)
        .toFixed(0);
    },
  },
});
