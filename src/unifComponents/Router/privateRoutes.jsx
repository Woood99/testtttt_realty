import ApartmentCreate from '../../admin/pages/Apartment/ApartmentCreate';
import ApartmentEdit from '../../admin/pages/Apartment/ApartmentEdit';
import CityCreate from '../../admin/pages/City/CityCreate';
import CityEdit from '../../admin/pages/City/CityEdit';
import CityList from '../../admin/pages/City/CityList';
import DashboardAdmin from '../../admin/pages/DashboardAdmin';
import ObjectCreate from '../../admin/pages/Object/ObjectCreate';
import ObjectEdit from '../../admin/pages/Object/ObjectEdit';
import TagCreate from '../../admin/pages/Tags/TagCreate';
import TagEdit from '../../admin/pages/Tags/TagEdit';
import TagsList from '../../admin/pages/Tags/TagsList';
import CreateChar from '../../admin/pages/Types/CreateChar';
import CreateCharApart from '../../admin/pages/Types/CreateCharApart';
import EditChar from '../../admin/pages/Types/EditChar';
import EditCharApart from '../../admin/pages/Types/EditCharApart';
import TypesCreate from '../../admin/pages/Types/TypesCreate';
import TypesList from '../../admin/pages/Types/TypesList';
import TypesShow from '../../admin/pages/Types/TypesShow';
import { PrivateRoutesPath } from '../../constants/RoutesPath';
import DevelopersCreate from '../../pages/Developers/DevelopersCreate';
import ListingFlats from '../../pages/ListingFlats';
import PurchaseCreate from '../../pages/PurchaseCreate';
import SpecialistCreate from '../../pages/Specialists/SpecialistCreate';

export const privateRoutes = [
   {
      path: '',
      body: <DashboardAdmin />,
   },
   {
      path: PrivateRoutesPath.types.list,
      body: <TypesList />,
   },

   {
      path: PrivateRoutesPath.types.create,
      body: <TypesCreate />,
   },
   {
      path: `${PrivateRoutesPath.types.show}:id`,
      body: <TypesShow />,
   },
   {
      path: PrivateRoutesPath.types.createChars,
      body: <CreateChar />,
   },
   {
      path: PrivateRoutesPath.types.createCharsApart,
      body: <CreateCharApart />,
   },
   {
      path: PrivateRoutesPath.listingFlats,
      body: <ListingFlats isAdmin />,
      main_layout_hidden: true,
   },
   {
      path: PrivateRoutesPath.objects.create,
      body: <ObjectCreate />,
   },
   {
      path: `${PrivateRoutesPath.objects.edit}:id`,
      body: <ObjectEdit />,
   },

   {
      path: PrivateRoutesPath.types.editChar,
      body: <EditChar />,
   },
   {
      path: PrivateRoutesPath.types.editCharApart,
      body: <EditCharApart />,
   },
   {
      path: `${PrivateRoutesPath.apartment.create}:objectId`,
      body: <ApartmentCreate />,
   },
   {
      path: `${PrivateRoutesPath.apartment.edit}:id`,
      body: <ApartmentEdit />,
   },

   {
      path: PrivateRoutesPath.cities.list,
      body: <CityList />,
   },
   {
      path: PrivateRoutesPath.cities.create,
      body: <CityCreate />,
   },
   {
      path: `${PrivateRoutesPath.cities.edit}:cityId`,
      body: <CityEdit />,
   },

   {
      path: PrivateRoutesPath.tags.list,
      body: <TagsList />,
   },
   {
      path: PrivateRoutesPath.tags.createTag,
      body: <TagCreate type="tag" />,
   },
   {
      path: PrivateRoutesPath.tags.createSticker,
      body: <TagCreate type="sticker" />,
   },
   {
      path: PrivateRoutesPath.tags.createAdvantage,
      body: <TagCreate type="advantage" />,
   },
   {
      path: `${PrivateRoutesPath.tags.editTag}:id`,
      body: <TagEdit type="tag" />,
   },
   {
      path: `${PrivateRoutesPath.tags.editSticker}:id`,
      body: <TagEdit type="sticker" />,
   },
   {
      path: `${PrivateRoutesPath.tags.editAdvantage}:id`,
      body: <TagEdit type="advantage" />,
   },
   {
      path: PrivateRoutesPath.specialists.create,
      body: <SpecialistCreate />,
   },
   {
      path: `${PrivateRoutesPath.specialists.edit}:id`,
      body: <SpecialistCreate edit />,
   },
   {
      path: PrivateRoutesPath.developers.create,
      body: <DevelopersCreate />,
   },
   {
      path: `${PrivateRoutesPath.developers.edit}:id`,
      body: <DevelopersCreate edit />,
   },
   {
      path: PrivateRoutesPath.purchase.create,
      body: <PurchaseCreate isAdmin />,
      main_layout_hidden: true,
   },
   {
      path: `${PrivateRoutesPath.purchase.edit}:id`,
      body: <PurchaseCreate isEdit isAdmin />,
      main_layout_hidden: true,
   },
];
