"use client";
import React from "react";
import dynamic from "next/dynamic";

// Импортируем компонент карты динамически с отключением SSR
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

const Maps: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Map />
    </div>
  );
};

export default Maps;
