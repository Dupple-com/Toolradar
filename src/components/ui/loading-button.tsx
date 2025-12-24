"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

/**
 * A button component with built-in loading state.
 *
 * @example
 * <LoadingButton isLoading={isSubmitting} loadingText="Saving...">
 *   Save Changes
 * </LoadingButton>
 */
export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      isLoading = false,
      loadingText,
      variant = "primary",
      size = "md",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary",
      ghost:
        "hover:bg-accent hover:text-accent-foreground focus:ring-primary",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? loadingText || children : children}
      </button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
