import { createContext } from 'react';

export const LayoutContext = createContext();
export const HeaderContext = createContext();

export const ListingFlatsContext = createContext();

export const BuildingApartsContext = createContext();
export const ApartmentContext = createContext();
export const BuildingContext = createContext({
   apartmentsLastUpdate: '',
});

export const MyObjectsContext = createContext();
export const RecordsApplyContext = createContext();
export const PurchaseCreateContext = createContext();
export const PurchaseListContext = createContext();
export const PurchasePageContext = createContext();
export const ProfileEditContext = createContext();

export const FeedContextLayout = createContext();
export const FeedContext = createContext();

export const DetailedStatisticsContext = createContext();

export const SpecialistPageContext = createContext();
export const DeveloperPageContext = createContext();

export const BlockCardsPrimaryContext = createContext();

export const SuggestionsContext = createContext();
export const SuggestionsCardActionsContext = createContext();

export const ChatContext = createContext();
export const ChatMessagesContext = createContext({
   draftOptions: null,
});
export const ChatMessageContext = createContext();
export const ChatVoiceRecorderContext = createContext();

export const VideoCallContext = createContext();
export const StreamContext = createContext();
