import React from "react";

import { useOneUILinkClassNames } from "./OneUILink.styles.js";
import type { OneUILinkProps } from "./OneUILink.types.js";

export const OneUILink = React.forwardRef<HTMLElement, OneUILinkProps>((props, ref) => {
  const {
    as,
    children,
    className,
    disabled = false,
    href,
    icon,
    iconPosition = "after",
    onClick,
    rel,
    target,
    tone = "brand",
    type = "button",
    underline = "hover",
    ...restProps
  } = props;
  const resolvedTag = disabled ? "span" : as ?? (href ? "a" : onClick ? "button" : "span");
  const interactive = resolvedTag !== "span";
  const classNames = useOneUILinkClassNames({
    className,
    disabled,
    interactive,
    tone,
    underline
  });
  const content = (
    <>
      {icon && iconPosition === "before" ? <span className={classNames.icon}>{icon}</span> : null}
      <span className={classNames.content}>{children}</span>
      {icon && iconPosition === "after" ? <span className={classNames.icon}>{icon}</span> : null}
    </>
  );

  if (resolvedTag === "button") {
    return (
      <button
        {...restProps}
        className={classNames.root}
        data-oneui-link=""
        disabled={disabled}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement> | undefined}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={type}
      >
        {content}
      </button>
    );
  }

  if (resolvedTag === "a") {
    return (
      <a
        {...restProps}
        className={classNames.root}
        data-oneui-link=""
        href={href}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        rel={rel}
        target={target}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      {...restProps}
      aria-disabled={disabled || undefined}
      className={classNames.root}
      data-oneui-link=""
      ref={ref as React.ForwardedRef<HTMLSpanElement>}
    >
      {content}
    </span>
  );
});

OneUILink.displayName = "OneUILink";
