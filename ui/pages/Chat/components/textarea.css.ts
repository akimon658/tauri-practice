import { style } from "@vanilla-extract/css";

export const textareaStyle = style({
  padding: "0.5rem",
  fontSize: "1rem",
  lineHeight: "1.5",
  borderRadius: "0.375rem",
  border: "1px solid #ccc",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
  resize: "vertical",

  selectors: {
    "&:focus": {
      outline: "none",
      borderColor: "#007bff",
      boxShadow: "0 0 0 3px rgba(0,123,255,0.25)",
    },
    "&::placeholder": {
      color: "#6c757d",
    },
  },
})
