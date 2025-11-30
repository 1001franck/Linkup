/**
 * Composant Typography - Atom
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la typographie
 * - Open/Closed : Extensible via variants
 * - Interface Segregation : Props spécifiques et optionnelles
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      sm: "text-sm font-medium leading-none", // Alias pour small
      muted: "text-sm text-muted-foreground",
      xs: "text-xs font-medium leading-none", // Ajout de xs
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof React.JSX.IntrinsicElements;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    // Mapper les variantes vers des éléments HTML appropriés
    const getElementType = (variant: string | null | undefined) => {
      if (as) return as;
      
      switch (variant) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return variant;
        case "blockquote":
          return "blockquote";
        case "list":
          return "ul";
        case "inlineCode":
          return "code";
        case "lead":
        case "large":
        case "small":
        case "muted":
        case "p":
        default:
          return "p";
      }
    };
    
    const Component = getElementType(variant);
    
    return React.createElement(
      Component,
      {
        className: cn(typographyVariants({ variant, className })),
        ref,
        ...props,
      }
    );
  }
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };
