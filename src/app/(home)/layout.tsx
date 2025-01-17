import { ReactNode } from "react";

type Props = { children: ReactNode; modal: ReactNode };

export default async function Layout({ children, modal }: Props) {
  return (
    <div className="h-dvh w-full p-4 overflow-hidden bg-gradient-to-br from-[#f8feff] via-[#d6f5fc] to-[#b3e5f5]">
      {children}
      {modal}
    </div>
  );
}
