import React, { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return <div className="w-full max-w-2xl mx-auto h-screen">{children}</div>;
}

export default Layout;
