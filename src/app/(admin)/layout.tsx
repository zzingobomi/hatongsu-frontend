import { ReactNode } from "react";

type Props = { children: ReactNode };

export default async function Layout({ children }: Props) {
  return <div>{children}</div>;
}
