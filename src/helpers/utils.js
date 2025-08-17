import { ROLE_ADMIN, ROLE_BUYER, ROLE_SELLER } from '@/constants';

export const isSeller = userInfo => userInfo?.role?.id === ROLE_SELLER.id;
export const isBuyer = userInfo => userInfo?.role?.id === ROLE_BUYER.id;
export const isAdmin = userInfo => userInfo?.role?.id === ROLE_ADMIN.id;
