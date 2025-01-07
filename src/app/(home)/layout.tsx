import { ReactNode } from "react";

type Props = { children: ReactNode; modal: ReactNode };

export default async function Layout({ children, modal }: Props) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}
