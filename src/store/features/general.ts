import { create } from "zustand";

type State = {
  pageName: string;
};
type Action = {
  replacePageName: (pageName: State["pageName"]) => void;
};

const useGeneral = create<State & Action>((set) => ({
  pageName: "Dashboard",
  replacePageName: (pageName) => set(() => ({ pageName })),
}));

export default useGeneral;
