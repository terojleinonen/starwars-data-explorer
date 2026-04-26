export type FilterOptionBuilder<T> = {
  key: string;
  label: string;
  getOptions: (records: T[]) => string[];
  matches: (record: T, selected: string[]) => boolean;
};

export type SortOption<T> = {
  label: string;
  value: string;
  compare: (a: T, b: T) => number;
};

export type DashboardConfig<T> = {
  category: string;
  title: string;
  subtitle: string;

  records: T[];
  extractId: (record: T) => string;

  matchesSearch: (record: T, search: string) => boolean;

  filters?: FilterOptionBuilder<T>[];
  sorts?: SortOption<T>[];

  renderCard: (
    record: T,
    active: boolean,
    onSelect: () => void
  ) => React.ReactNode;

  renderPanel: (record: T) => React.ReactNode;

  renderStats?: (all: T[], visible: T[]) => React.ReactNode;
};