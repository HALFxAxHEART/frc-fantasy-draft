import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Bug, LogOut } from "lucide-react";
import { ProfilePicture } from "../ProfilePicture";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavBarProps {
  user: any;
  displayName: string;
  profilePicture: string | null;
  onProfileUpdate: (url: string) => void;
  onSignOut: () => void;
  onBugReport: () => void;
}

export const NavBar = ({
  user,
  displayName,
  profilePicture,
  onProfileUpdate,
  onSignOut,
  onBugReport,
}: NavBarProps) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold">FRC Fantasy Draft</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onBugReport}
          >
            <Bug className="h-5 w-5" />
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0">
                  <ProfilePicture
                    userId={user.id}
                    displayName={displayName}
                    currentUrl={profilePicture || undefined}
                    onUpdate={onProfileUpdate}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};