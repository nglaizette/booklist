export type Label = {
  name: string;
  textColor: string;
  backgroundColor: string;
};

export type LabelColors = { backgroundColor: string; textColor: string };

export type HierarchicalLabel = Label & {
  childLevel: number;
  prepend: Label[];
  disabled: boolean;
};
