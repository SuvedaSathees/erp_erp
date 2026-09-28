import * as React from "react";
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

export function toast(props: ToastProps | string) {
  if (typeof props === "string") {
    return sonnerToast(props);
  }

  const titleText = props?.title ? String(props.title) : "";
  const descText = props?.description ? String(props.description) : undefined;

  if (props?.variant === "destructive") {
    return sonnerToast.error(titleText || "Error", {
      description: descText,
    });
  }

  return sonnerToast(titleText, {
    description: descText,
  });
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  };
}

export default useToast;
