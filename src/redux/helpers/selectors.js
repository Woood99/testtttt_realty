import { createSelector } from 'reselect';
import isEmptyArrObj from '../../helpers/isEmptyArrObj';
import { ROLE_ADMIN } from '../../constants/roles';

export const getMainInfo = state => state.mainInfo;
export const getHelpSliceSelector = state => state.helpSlice;
export const getVideoCallInfo = state => state.videoCall;

export const getUserInfo = state => state.mainInfo?.userInfo;
export const getUserIsAdmin = createSelector(
   state => state.mainInfo?.userInfo,
   userInfo => userInfo?.role?.id === ROLE_ADMIN.id
);
export const checkAuthUser = createSelector([getUserInfo], user => !isEmptyArrObj(user));
export const authLoadingSelector = state => state.mainInfo?.authLoading;

export const getWindowSize = state => state.windowSize;
export const getIsDesktop = state => state.windowSize?.isDesktop;

export const getCitiesSelector = state => state.mainInfo?.cities || [];
export const getCitiesValuesSelector = createSelector([getCitiesSelector], cities => cities.map(item => ({ label: item.name, value: item.id })));

export const getCurrentCitySelector = state => state.mainInfo?.city;
export const getCurrentCityNameSelector = state => state.mainInfo?.city?.name;
