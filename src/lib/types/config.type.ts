export type ConfigType = {
  provider: ProviderType;
};

export type ProviderType = {
  [key: string]: {
    url: string;
    limit?: number;
    rate?: number;
    endpoints?: {
      [key: string]: string;
    };
  };
};
