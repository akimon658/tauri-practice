import { style } from "@vanilla-extract/css";

export const chatPageLayout = style({
  height: "100dvh",
  width: "100dvw",
})

export const inputContainer = style({
  alignItems: "end",
  display: "flex",
  gap: 8,
  padding: 16,
  position: "sticky",
  zIndex: 10,
})

export const textareaStyle = style({
  flexGrow: 1,
})
