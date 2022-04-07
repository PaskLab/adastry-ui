type MonthlyStatsType = {
  month: string;
  value: number;
};

export type MonthlyStatsListType = {
  from: string;
  data: MonthlyStatsType[];
};
