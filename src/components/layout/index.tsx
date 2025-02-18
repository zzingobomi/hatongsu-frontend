import Footer from "@/components/footer/FooterAdmin";
import Navbar from "@/components/navbar/NavbarAdmin";
import Sidebar from "@/components/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { User } from "@/model/User";
import { usePathname } from "next/navigation";
import { OpenContext, UserContext } from "@/contexts/layout";
import React from "react";
import { routes } from "../routes";
import { getActiveRoute } from "@/utils/navigation";

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
  user: User | null | undefined;
}

const DashboardLayout: React.FC<Props> = (props: Props) => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <UserContext.Provider value={props.user}>
      <OpenContext.Provider value={{ open, setOpen }}>
        <div className="dark:bg-background-900 flex h-full w-full bg-white">
          <Toaster />
          <Sidebar routes={routes} setOpen={setOpen} />
          <div className="h-full w-full dark:bg-zinc-950">
            <main
              className={`mx-2.5 flex-none transition-all dark:bg-zinc-950 md:pr-2 xl:ml-[328px]`}
            >
              <div className="mx-auto min-h-screen p-2 !pt-[90px] md:p-2 md:!pt-[118px]">
                {props.children}
              </div>
              <Navbar brandText={getActiveRoute(routes, pathname)} />
              {/* <div className="p-3">
                <Footer />
              </div> */}
            </main>
          </div>
        </div>
      </OpenContext.Provider>
    </UserContext.Provider>
  );
};

export default DashboardLayout;
