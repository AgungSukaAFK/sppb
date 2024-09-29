import LoadingContext from "@/context/LoadingContext";
import { useContext } from "react";

// Hook untuk menggunakan context dengan mudah
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
};
