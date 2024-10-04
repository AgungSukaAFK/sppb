"use client";

import { useLoading } from "@/hooks/useLoading";
import Loading from "@/pages/component/Loading";
import React from "react";
import { ReactNode } from "react";

export default function LoadingProvider({ children }: { children: ReactNode }) {
  const { isLoading } = useLoading();
  return (
    <>
      <Loading isLoading={isLoading} />
      {children}
    </>
  );
}
