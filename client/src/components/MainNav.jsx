import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { SignUpButton } from "@clerk/clerk-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";

const MainNav = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <>
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-lg px-4 py-2">
                Models
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-[200px]">
                <ul className="flex flex-col gap-2">
                  <li>
                    <NavigationMenuLink href="/models/gemini">
                      Gemini
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="/models/claude">
                      Claude
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="/models/deepseek">
                      DeepSeek
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/chat" className="text-lg px-4 py-2">
                Gallery
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="/chat" className="text-lg px-4 py-2">
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="/chat" className="text-lg px-4 py-2">
                FAQ
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="hidden md:flex">
        {isSignedIn ? (
          <div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center justify-end">
                <ThemeToggle />
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center scale-120">
                <UserButton />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className=" flex">
              <div className="mr-5 mt-0.5 ">
                <ThemeToggle />
              </div>
              <div>
                <SignUpButton mode="modal">

                <Button className="cursor-pointer">Sign Up</Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainNav;
