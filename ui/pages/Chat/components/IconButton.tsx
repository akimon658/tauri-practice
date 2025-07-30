import { AccessibleIcon } from "radix-ui";
import React from "react";
import { iconButtonStyle } from "./icon_button.css";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
}

export const IconButton = (props: IconButtonProps) => {
  return <button {...props} className={iconButtonStyle}>
    <AccessibleIcon.Root label={props.label}>
      {props.children}
    </AccessibleIcon.Root>
  </button>
}
