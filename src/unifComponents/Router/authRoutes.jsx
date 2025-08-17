import { AuthRoutesPath } from '../../constants/RoutesPath';
import ProfileEdit from '../../pagesUser/Profile/ProfileEdit';

export const authRoutes = [
   {
      path: AuthRoutesPath.profile.edit,
      body: <ProfileEdit />,
   },
];
