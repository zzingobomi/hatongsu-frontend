"use client";

import { LinkProps as NextLinkProps } from "next/link";
import { Link } from "next-view-transitions";
import { CSSProperties, PropsWithChildren, useMemo } from "react";

export type NavLinkProps = NextLinkProps &
  PropsWithChildren & {
    styles?: CSSProperties;
    borderRadius?: string;
  };

function NavLink({ className, children, styles, borderRadius, ...props }: any) {
  const memoizedStyles = useMemo(
    () => ({
      borderRadius: borderRadius || 0,
      ...styles,
    }),
    [borderRadius, styles]
  );

  return (
    <Link className={`${className}`} style={memoizedStyles} {...props}>
      {children}
    </Link>
  );
}

export default NavLink;
