export type ActiveTab = 'dashboard' | 'inventory' | 'loans' | 'maintenance' | 'audit' | 'security';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export { AppProvider, useApp } from './SupabaseAppContext';
