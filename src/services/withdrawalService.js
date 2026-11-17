import { auth } from '../config/firebase';

const API_URL = process.env.EXPO_PUBLIC_WITHDRAWAL_API_URL;

async function request(path, options = {}) {
  if (!API_URL) throw new Error('WITHDRAWAL_API_NOT_CONFIGURED');
  const user = auth.currentUser;
  if (!user) throw new Error('AUTH_REQUIRED');
  const token = await user.getIdToken();
  const response = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'WITHDRAWAL_ERROR');
  return data;
}

export const createWithdrawalRequest = () =>
  request('/withdrawals', { method: 'POST', body: JSON.stringify({}) });

export const getWithdrawalRequests = () => request('/withdrawals', { method: 'GET' });
