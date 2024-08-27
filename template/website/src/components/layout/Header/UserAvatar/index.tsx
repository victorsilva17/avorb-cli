"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CiLogout } from "react-icons/ci";

export function UserAvatar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="icon" className="px-2">
          <Avatar className="size-8">
            <AvatarImage
              className="bg-orange-600"
              src="https://avatars.githubusercontent.com/u/64802572?v=4"
            />
            <AvatarFallback className="bg-slate-800">CN</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"} className="w-[320px]">
        <SheetHeader>
          <SheetTitle>Perfil</SheetTitle>
          <SheetDescription className="flex gap-2 items-center">
            <span>Sessão do usuário</span>
            <Badge variant={"secondary"}>ativa</Badge>
          </SheetDescription>
        </SheetHeader>

        <ul className="list-none my-6">
          <li>
            <div className="flex flex-row items-center gap-2">
              <strong>Nome:</strong>
              <span>John Doe</span>
            </div>
          </li>
          <li>
            <div className="flex flex-row items-center gap-2">
              <strong>E-mail:</strong>
              <span>John@doe.com</span>
            </div>
          </li>
        </ul>

        <SheetFooter>
          <Button variant="destructive" className="flex items-center gap-4">
            <CiLogout size={24} />
            Sair
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
