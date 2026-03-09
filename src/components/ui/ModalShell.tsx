// Modal shell: lock body scroll and close on ESC.
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  closeHref: string;
  children: React.ReactNode;
};

export default function ModalShell({ closeHref, children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeModal = () => {
      if (window.history.length > 1) {
        router.back();
        return;
      }

      router.push(closeHref, { scroll: false });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [router, closeHref]);

  return <>{children}</>;
}
