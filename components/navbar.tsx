"use client";

import { Tabs, Tab, Button } from "@nextui-org/react";
import { MusicIcon, HeartFilledIcon, SunIcon, MoonIcon } from "./icons";
import React from "react";

export const Navbar = () => {
  const color = "primary" as const;

  return (
      <div className="mx-auto p-2">
        <Tabs key="navbar" color={color} radius="full">
          <Tab key="photos" title="Photos" />
          <Tab key="music" title="Music" />
          <Tab key="videos" title="Videos" />
          <Tab key="finance" title="Finance" />
          <Tab key="person" title="Person" />
          <Tab
            key="theme"
            title={<MoonIcon/>}
          />
        </Tabs>
      </div>
  );
};