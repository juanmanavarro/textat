import { useWsStore  } from '@/stores/ws';

export function useWs() {
  const wsStore = useWsStore();
  return wsStore.socket;
}
