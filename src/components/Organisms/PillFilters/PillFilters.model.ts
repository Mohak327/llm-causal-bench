export const sizeMap = {
  sm: { padY: "py-1", padX: "px-2", gap: "gap-1" },
  md: { padY: "py-2", padX: "px-3 md:px-4", gap: "gap-2" },
  lg: { padY: "py-3", padX: "px-5", gap: "gap-3" },
} as const;

export type SizeKey = keyof typeof sizeMap;
