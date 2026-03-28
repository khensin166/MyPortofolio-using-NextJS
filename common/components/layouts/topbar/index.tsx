"use client";

import TopbarProfile from "./TopbarProfile";
import TopbarMenu from "./TopbarMenu";

const Topbar = () => {
  return (
    <header className="flex flex-col w-full px-2 sm:px-4">
      <div className="flex flex-col rounded-3xl overflow-hidden border border-border shadow-sm mt-4">
        <TopbarProfile />
        <TopbarMenu />
      </div>
    </header>
  );
};

export default Topbar;
