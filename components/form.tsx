"use client";

import React from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useClient, updateClaim, selectClaim } from "@/context/client";

export const SignForm = () => {
  const { client } = useClient();
  
  const [selected, setSelected] = React.useState<string>("login");
  const [name, setName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let person = await client.person.claim(name, password);
    client.claim = person.claim;
    updateClaim(person.claim)
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log((await client.health.ping()).timestamp);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-full w-[340px] h-[400px]">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            size="md"
            onSelectionChange={setSelected as (key: React.Key) => void}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <Input
                  isRequired
                  label="NAME"
                  placeholder="Enter your name"
                  type="name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  isRequired
                  label="PASSWORD"
                  placeholder="Enter your password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign-up")}>
                    Sign up
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Login
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <form
                className="flex flex-col gap-4 h-[300px]"
                onSubmit={handleSignUp}
              >
                <Input
                  isRequired
                  label="NAME"
                  placeholder="Enter your name"
                  type="name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  isRequired
                  label="NAME"
                  placeholder="Enter your name"
                  type="name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  isRequired
                  label="PASSWORD"
                  placeholder="Enter your password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Sign up
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};
