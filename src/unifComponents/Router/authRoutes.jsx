import { AuthRoutesPath } from '../../constants/RoutesPath';
import ChatPage from '../../pages/ChatPage';
import ProfileEdit from '../../pagesUser/Profile/ProfileEdit';

export const authRoutes = [
   {
      path: AuthRoutesPath.profile.edit,
      body: <ProfileEdit />,
   },
   {
      path: AuthRoutesPath.chat,
      body: <ChatPage />,
   },
];
