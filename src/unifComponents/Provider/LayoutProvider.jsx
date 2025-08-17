import { LayoutContext } from '@/context';
import { useUserAuth } from './useUserAuth';

const LayoutProvider = ({ children }) => {
   const { setAuthUser, userConnectionEcho, getAuthUser, logout } = useUserAuth();

   return <LayoutContext.Provider value={{ setAuthUser, userConnectionEcho, getAuthUser, logout }}>{children}</LayoutContext.Provider>;
};

export default LayoutProvider;
