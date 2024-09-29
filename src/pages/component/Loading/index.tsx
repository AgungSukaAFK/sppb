import React from "react";
import "./index.css";

export default function Loading({ isLoading }: any) {
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
