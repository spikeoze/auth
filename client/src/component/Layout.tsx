import React, { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return <div className="w-full md:max-w-2xl mx-auto h-screen border-x border-slate-600">{children}</div>;
}

export default Layout;
