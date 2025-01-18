"use client";

import { Tabs, Tab } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export type TabItem = {
  key: string;
  title: React.ReactNode;
  href?: string;
};

type NavbarProps = {
  tabs: TabItem[];
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
};

export const Navbar = ({
  tabs,
  color = "primary",
  radius = "full",
  className,
}: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const selectedTab = () => {
    const currentTab = tabs.find((tab) => tab.href === pathname);
    return currentTab ? currentTab.key : tabs[0]?.key;
  };

  return (
    <div className={className}>
      <Tabs
        key="navbar"
        color={color}
        radius={radius}
        selectedKey={selectedTab()}
        onSelectionChange={(key) => {
          const selectedTab = tabs.find((tab) => tab.key === key);
          if (selectedTab?.href) {
            router.push(selectedTab.href);
          }
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            title={
              tab.href ? (
                <Link href={tab.href} passHref>
                  {tab.title}
                </Link>
              ) : (
                tab.title
              )
            }
          />
        ))}
      </Tabs>
    </div>
  );
};
