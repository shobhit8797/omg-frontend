import {
    LifeBuoy,
    LogOut,
    MonitorCog,
    Moon,
    Settings,
    Sun,
    SunMoon,
    User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, Menu, Package2 } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export const NavBar = () => {
    const { theme, setTheme } = useTheme();
    
    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("token");
        window.location.href = "/signin";
    };


    return (
        <>
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link
                        href="#"
                        className="text-foreground transition-colors hover:text-foreground"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Orders
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Products
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Customers
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Analytics
                    </Link>
                </nav>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">
                                Toggle navigation menu
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link href="#" className="hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Orders
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Products
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Customers
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Analytics
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="flex w-full justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="overflow-hidden rounded-full"
                            >
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <SunMoon className="mr-2 h-4 w-4" />
                                    <span>Theme</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup
                                            value={theme}
                                            onValueChange={setTheme}
                                        >
                                            <DropdownMenuRadioItem value="light">
                                                <Sun className="mr-2 h-4 w-4" />
                                                <span>Light</span>
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="dark">
                                                <Moon className="mr-2 h-4 w-4" />
                                                <span>Dark</span>
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="system">
                                                <MonitorCog className="mr-2 h-4 w-4" />
                                                <span>System</span>
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem>
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                <span>Support</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleLogout} className="hover:cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </>
    );
};
