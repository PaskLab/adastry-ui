export type GlobalMappingType = {
  name: string;
  hexId: string;
  fingerprint: string;
  koinlyId: string;
  activeKoinlyId: boolean;
};

export type GlobalMappingListType = {
  count: number;
  data: GlobalMappingType[];
};
