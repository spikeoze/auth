import React, { ReactElement, ReactNode } from "react";
import { PostForm, UserComponent } from "./PostForm";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <>
      <div className="relative w-full md:max-w-2xl mx-auto h-screen border-x border-slate-600">
        <UserComponent />
        {children}
      </div>
    </>
  );
}

export default Layout;
