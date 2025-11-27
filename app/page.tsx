'use client';

import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { Frown } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();

  return (
      <div className="p-5">
        { isConnected ? (
            <>You are connected to the page.</>
        ) : (
            <Alert className="bg-yellow-100">
              <Frown />
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                You must connect your wallet to use this DApp.
              </AlertDescription>
            </Alert>
        )}
      </div>
  );
}
