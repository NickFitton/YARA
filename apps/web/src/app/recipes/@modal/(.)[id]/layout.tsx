"use client";

import { Dialog } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export default function ModalLayout({ children }: PropsWithChildren<object>) {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      {children}
    </Dialog>
  );
}
