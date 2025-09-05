import { nanoid } from 'nanoid';

export function getClientId() {
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
      clientId = nanoid();
      localStorage.setItem('clientId', clientId);
    }
    return clientId;
  }
