import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
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
import { AppContext } from "@/context/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";

const MainNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUserName] = useState("Rudra");

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
        {isLoggedIn ? (
          <div>
            <div className=" flex">
              <div className="mr-5 mt-0.5">
                <ThemeToggle />
              </div>
              <div>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-lg px-4 py-2">
                        <div
                          className="bg-gray-200  text-gray-900 w-10 h-10 rounded-full flex items-center justify-center text-2xl mr-5 border border-gray-600 cursor-pointer  focus:outline-none focus:ring-0 focus-visible:ring-0 active:bg-transparent
              "
                        >
                          {username.toUpperCase().charAt(0)}
                        </div>
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
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
          </div>
        ) : (
          <div>iSgn in</div>
        )}
      </div>
    </>
  );
};

export default MainNav;
