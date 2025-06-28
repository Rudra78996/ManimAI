import ThemeToggle from "@/components/ThemeToggle";
import {UserButton} from "@clerk/clerk-react";
import {useNavigate } from "react-router-dom";

const ChatNavbar = () => {
  const navigate = useNavigate();
  return (
    <div className=" h-[7%] flex w-full items-center justify-between border-b-2 border-foreground/10">
      <div className="ml-1.5">
        <img
          src="/icon.png"
          alt="ManimAI"
          className="h-12 dark:invert cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="flex gap-4 items-center mr-8">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center scale-120">
          <UserButton />
        </div>
      </div>
    </div>
  );
};
export default ChatNavbar;
