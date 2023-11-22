import { ReactNode } from "react";

import { SideBarView } from "../sidebar/view";

export function Page({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div
      id={id}
      role="main"
      className="h-screen w-full flex items-center gap-8 py-4 overflow-hidden text-neutral bg-primary-background"
    >
      <SideBarView />
      <div className="flex flex-col gap-4 bg-secondary-background p-5 rounded-2xl w-full h-full mx-4 shadow">
        {children}
      </div>
    </div>
  );
}
