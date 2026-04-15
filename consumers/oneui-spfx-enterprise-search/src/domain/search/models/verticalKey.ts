export const verticalKeys = [
  "all",
  "it-hr-colleague-direct",
  "sites-events",
  "news",
  "people",
  "resources",
  "files"
] as const;

export type VerticalKey = (typeof verticalKeys)[number];

export const isVerticalKey = (value: string | undefined): value is VerticalKey => {
  return Boolean(value && verticalKeys.indexOf(value as VerticalKey) >= 0);
};
