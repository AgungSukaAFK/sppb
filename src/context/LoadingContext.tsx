"use client";
import Loading from "@/pages/component/Loading";
import React, { createContext, FC, ReactNode, useState } from "react";

// Definisikan tipe data untuk context
interface LoadingContextProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

interface LoadingProviderProps {
  children: ReactNode;
}

// Buat context dengan nilai default
const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

// Buat provider komponen
export const LoadingProvider: FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading }}>
      <Loading isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
