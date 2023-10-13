import { ReactNode } from "react";

import { SideBarView } from "../SideBar/SideBarView";

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center gap-8 py-4 overflow-hidden text-neutral-100">
      <SideBarView />
      <div className="flex flex-col gap-4 bg-neutral/5 p-5 rounded-2xl w-full h-full mx-4 shadow">
        {children}
      </div>
    </div>
  );
}
