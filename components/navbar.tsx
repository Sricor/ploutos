"use client";

import { Tabs, Tab } from "@nextui-org/react";
import { MusicIcon, HeartFilledIcon, SunIcon, MoonIcon } from "./icons";
import React from "react";


export const Navbar = () => {
  const color = "primary" as const;
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // 这里可以添加切换主题的逻辑，比如修改全局状态或调用主题切换的 API
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <div className="bg-background shadow-lg rounded-t-lg">
      <div className="mx-auto p-2">
        <Tabs key="navbar" color={color} radius="full">
          <Tab key="photos" title="Photos" />
          <Tab key="music" title="Music" />
          <Tab key="videos" title="Videos" />
          <Tab key="finance" title="Finance" />
          <Tab key="person" title="Person" />
          <Tab
            key="theme"
            title={
              <div className="flex items-center space-x-2">
                {isDarkMode ? <MoonIcon /> : <SunIcon />}
                <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
              </div>
            }
            onClick={toggleTheme} // 自定义点击事件
          />
        </Tabs>
      </div>
    </div>
  );
};