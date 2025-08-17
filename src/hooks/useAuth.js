import { useContext } from 'react';
import { LayoutContext } from '@/context';

export const useAuth = () => useContext(LayoutContext);
