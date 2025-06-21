import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { AlignJustify } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
const MobileNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    <div className="md:hidden flex gap-3">
      <Sheet>
        <SheetTrigger>
          {" "}
          <AlignJustify />
        </SheetTrigger>
        <SheetContent>
          {!isLoggedIn ? (
            <div>
              <ul className="h-screen flex flex-col text-end font-bold mt-15 mr-8 ">
                <li className="mb-4">Sign Up</li>
                <li className="mb-4">Gallery</li>
                <li className="mb-4">Contact</li>
                <li>FAQ</li>
              </ul>
            </div>
          ) : (
            <div>
              <ul className="h-screen flex flex-col text-end font-bold mt-15 mr-8 ">
                <li className="mb-4">Profile</li>
                <li className="mb-4">Gallery</li>
                <li className="mb-4">Contact</li>
                <li>FAQ</li>
              </ul>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
