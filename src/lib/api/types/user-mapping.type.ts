export type UserMappingType = {
  name: string;
  hexId: string;
  fingerprint: string;
  userKoinlyId: string;
  koinlyId: string;
  useGlobalKoinlyId: boolean;
};

export type UserMappingListType = {
  count: number;
  data: UserMappingType[];
};
