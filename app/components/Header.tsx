import type { FC } from "react";
import React, { useCallback } from "react";

import Logo from "~/icons/logo.webp";
import { useFetcher } from "@remix-run/react";
import Link from "~/components/Link";

type Props = {
  className: string;
};

const Header: FC<Props> = ({ className }) => {
  const fetcher = useFetcher();

  const handleLogout = useCallback(() => {
    fetcher.submit(null, {
      method: "post",
      action: "/logout",
    });
  }, []);

  return (
    <div
      className={`flex w-full items-center justify-between border-b-2 border-gray bg-bgAccent p-4 ${className}`}
    >
      <span className="flex items-center space-x-4">
        <img src={Logo} className="h-8 w-8" />
        <Link to="/tags">Tags</Link>
        <Link to="/test">Test</Link>
      </span>

      <Link to="/" onClick={handleLogout}>
        Logout
      </Link>
    </div>
  );
};

export default Header;
