import { createContext } from "react";
import { User } from "@/model/User";

interface OpenContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OpenContext = createContext<OpenContextType>({
  open: false,
  setOpen: () => {},
});
export const UserContext = createContext<User | undefined | null>(undefined);
