'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export function UserNav() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('Carregando...');
  const [initials, setInitials] = useState('U');

  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token) {
      try {
        // Decodifica o JWT (A parte do meio é o payload em Base64)
        // O formato é: header.payload.signature
        const payloadBase64 = token.split('.')[1];
        const payloadDecoded = atob(payloadBase64);
        const payload = JSON.parse(payloadDecoded);

        // Define o email e as iniciais
        if (payload.email) {
          setUserEmail(payload.email);
          setInitials(payload.email.substring(0, 2).toUpperCase());
        }
      } catch (error) {
        console.error("Erro ao ler token", error);
        setUserEmail("Usuário");
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border border-border">
            {/* Se quiser colocar foto depois, descomente a linha abaixo */}
            {/* <AvatarImage src="/avatars/01.png" alt="@usuario" /> */}
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Minha Conta</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/10">
          <LogOut className="mr-2 h-4 w-4" />
          Sair do Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}