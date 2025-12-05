export const OPEN_TAGS = {
  "<b>": "b",
  "<i>": "i",
  "<span class='highlight'>": "highlight",
} as const;

export const CLOSE_TAGS: Record<string, keyof typeof OPEN_TAGS | "span"> = {
  "</b>": "<b>",
  "</i>": "<i>",
  "</span>": "span",
};