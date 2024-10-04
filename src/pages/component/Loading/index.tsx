import React from "react";
import "./index.css";

interface LoadingProps {
  isLoading: boolean;
}

export default function Loading({ isLoading }: LoadingProps) {
  return (
    <>
      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}
    </>
  );
}
