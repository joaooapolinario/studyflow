"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import {
  Home,
  Calendar,
  Plus,
  BarChart2,
  User,
  Bell,
  LayoutDashboard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScheduleDialog } from "@/components/schedule-diaog";
import { CreateMateriaDialog } from "@/components/create-materia-dialog";
import { Materia } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
  materias: Materia[];
  periodoId?: string;
}

export function AppShell({ children, materias, periodoId }: AppShellProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Falha ao buscar perfil");
        })
        .then((data) => {
          if (data && data.nome) {
            const firstName = data.nome.split(" ")[0];
            const secondName = data.nome.split(" ")[1];
            setUserName(
              firstName.charAt(0).toUpperCase() +
                firstName.slice(1).toLowerCase() +
                " " +
                secondName.charAt(0).toUpperCase() +
                secondName.slice(1).toLowerCase(),
            );
          }
        })
        .catch((err) => console.error("Erro ao buscar perfil:", err));
    }
  }, []);

  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      name: "Horários",
      icon: Calendar,
      action: "schedule",
    },
    {
      name: "Nova Matéria",
      icon: Plus,
      action: "create",
      isFab: true,
    },
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "#dashboard",
      active: false,
    },
    {
      name: "Perfil",
      icon: User,
      href: "#profile",
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="text-xl font-bold tracking-tight text-foreground">
            StudyFlow
          </span>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-2 px-3">
            {navItems.map((item, index) => {
              if (item.isFab) {
                return (
                  <div key={index} className="px-3 py-2">
                    {periodoId && (
                      <CreateMateriaDialog
                        periodoId={periodoId}
                        className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-primary-foreground bg-primary hover:bg-primary/90"
                      />
                    )}
                  </div>
                );
              }

              if (item.action === "schedule") {
                return (
                  <div key={index} className="px-3 py-1">
                    <ScheduleDialog key={index} materias={materias}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Button>
                    </ScheduleDialog>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    item.active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User Profile (Bottom of Sidebar) */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName ? userName[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Bem vindo,</span>
              <span className="text-sm font-bold text-foreground truncate max-w-[120px]">
                {userName || "Usuário"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 
         ========================================
         MOBILE TOP BAR (< md)
         ========================================
      */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:ml-64 md:hidden">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {userName ? userName[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase leading-none text-muted-foreground">
              Bem vindo,
            </span>
            <span className="text-sm font-bold text-foreground">
              {userName || "Usuário"}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
      </header>

      <header className="hidden md:ml-64 md:flex md:h-16 md:items-center md:justify-between md:border-b md:border-border md:bg-background/95 md:px-8 md:backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Início</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="pb-24 pt-4 md:ml-64 md:pb-8 md:pt-8 px-4 md:px-8">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card px-2 pb-safe md:hidden">
        {navItems.map((item, index) => {
          if (item.isFab) {
            return (
              <div key={index} className="relative -top-5">
                {periodoId && (
                  <CreateMateriaDialog
                    periodoId={periodoId}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95 [&_svg]:h-6 [&_svg]:w-6"
                  />
                )}
              </div>
            );
          }

          if (item.action === "schedule") {
            return (
              <ScheduleDialog key={index} materias={materias}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex flex-col gap-1 h-auto py-1 text-muted-foreground hover:bg-transparent hover:text-foreground"
                >
                  <item.icon className={cn("h-6 w-6")} />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Button>
              </ScheduleDialog>
            );
          }

          return (
            <Link
              key={index}
              href={item.href || "#"}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
                item.active && "text-primary",
              )}
            >
              <item.icon
                className={cn("h-6 w-6", item.active && "fill-current")}
              />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
