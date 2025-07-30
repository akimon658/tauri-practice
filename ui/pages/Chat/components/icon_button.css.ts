import { style } from "@vanilla-extract/css";

export const iconButtonStyle = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.5rem",
  fontSize: "1rem",
  lineHeight: "1.5",
  borderRadius: "0.375rem",
  border: "1px solid transparent",
  backgroundColor: "#f8f9fa",
  color: "#212529",
  cursor: "pointer",
  transition: "background-color 0.2s, border-color 0.2s",

  selectors: {
    "&:hover": {
      backgroundColor: "#e9ecef",
      borderColor: "#ced4da",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(0,123,255,0.25)",
    },
    "&:disabled": {
      backgroundColor: "#e9ecef",
      color: "#6c757d",
      cursor: "not-allowed",
    },
  },
})
