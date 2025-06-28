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
import { useAuth, UserButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
const MobileNav = () => {
  const {isSignedIn} = useAuth();
  return (
    <div className="md:hidden flex gap-3">
      <Sheet>
        <SheetTrigger>
          {" "}
          <AlignJustify />
        </SheetTrigger>
        <SheetHeader>
           <SheetTitle></SheetTitle>
          <SheetContent>
            {!isSignedIn ? (
              <div>
                <ul className="h-screen flex flex-col text-end font-bold mt-15 mr-8 ">
                  <li className="mb-4"><SignUpButton mode="modal">

                <Button className="cursor-pointer">Sign Up</Button>
                </SignUpButton></li>
                  <li className="mb-4">
                    <Link to="/gallery">Gallery</Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/contact">Contact</Link>
                  </li>
                  <span
                  >
                    FAQ
                  </span>
                </ul>
              </div>
            ) : (
              <div>
                <ul className="h-screen flex flex-col text-end font-bold mt-15 mr-8 ">
                  <li className="mb-4">
                    <UserButton />
                  </li>
                  <li className="mb-4">
                    <Link to="/gallery">Gallery</Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/contact">Contact</Link>
                  </li>
                  <span
                    onClick={() => {
                      const section = document.getElementById("faq");
                      if (section) {
                        section.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    }}
                    className="cursor-pointer"
                  >
                    FAQ
                  </span>
                </ul>
              </div>
            )}
          </SheetContent>
        </SheetHeader>
      </Sheet>
    </div>
  );
};

export default MobileNav;
