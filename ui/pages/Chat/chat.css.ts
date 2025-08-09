import { style } from "@vanilla-extract/css";

export const chatPageLayout = style({
  height: "100dvh",
  width: "100dvw",
  display: "flex",
  flexDirection: "column",
  gap: 8,
})

export const messagesContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 16,
  overflowY: "auto",
})

export const messageStyleBase = style({
  padding: 8,
  borderRadius: 8,
  maxWidth: "80%",
  wordBreak: "break-word",
  alignSelf: "flex-start",
})

export const userMessageStyle = style({
  alignSelf: "flex-end",
  backgroundColor: "#f0f0f0",
})

export const zundamonMessageStyle = style({
  backgroundColor: "#d0f0c0",
})

export const inputContainer = style({
  alignItems: "end",
  display: "flex",
  gap: 8,
  padding: 16,
  zIndex: 10,
})

export const textareaStyle = style({
  flexGrow: 1,
})
