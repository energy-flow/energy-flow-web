'use client';

import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { Frown, Loader2 } from 'lucide-react';
import Link from 'next/link'
import { ROLE_ROUTES } from "@/lib/constants";
import {useUserRole} from "@/hooks/useUserRole";

export default function Home() {
  const { isConnected } = useAccount();
  const {role, isLoading } = useUserRole();

  return (
      <div className="p-5">
          {isLoading && (
              <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Vérification de vos droits...</span>
              </div>
          )}

          {/* A FAIRE */}
          {isConnected && !isLoading && role !== 'none' && (
              <div>
                  <span>Vous êtes connecté en tant que {role}</span>
                  <Link href={ROLE_ROUTES[role][0]} className="ml-4 text-blue-500 underline">
                      Aller au dashboard
                  </Link>
              </div>
          )}

          {isConnected && !isLoading && role === 'none' && (
              <Alert className="bg-orange-100">
                  <Frown />
                  <AlertTitle>Accès non autorisé</AlertTitle>
                  <AlertDescription>
                      Vous n'êtes pas encore enregistré dans une PMO.
                      Contactez votre association pour être ajouté comme membre.
                  </AlertDescription>
              </Alert>
          )}

          {!isConnected && (
              <Alert className="bg-yellow-100">
                  <Frown />
                  <AlertTitle>Attention!</AlertTitle>
                  <AlertDescription>
                      Vous devez connecter votre wallet pour utiliser cette DApp.
                  </AlertDescription>
              </Alert>
          )}
      </div>
  );
}
