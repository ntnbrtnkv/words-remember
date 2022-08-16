import type { FC } from "react";
import React from "react";
import Header from "~/components/Header";

const InsidePage: FC = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-bgNeutral text-textMain">
      <Header className="grow-0" />
      {children}
    </div>
  );
};

export default InsidePage;
