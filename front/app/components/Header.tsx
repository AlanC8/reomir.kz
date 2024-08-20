"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const Header: React.FC = () => {
    const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between bg-[#2C964E] h-[64px] px-5 z-50 shadow-lg">
        <span className="text-white font-bold text-lg cursor-pointer">
          ReOmir.kz
        </span>
        <ul className="flex gap-5 items-center">
          <img
            src="/burger.png"
            alt="Menu"
            className="cursor-pointer"
            onClick={toggleSidebar}
          />
        </ul>
      </header>
      <div className="h-[64px]" />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-semibold text-[#2C964E]">Меню</h2>
          <FaTimes
            className="text-gray-600 cursor-pointer hover:text-[#2C964E]"
            onClick={toggleSidebar}
          />
        </div>
        <ul className="mt-4">
          <li onClick={() => {
            router.push("/cloth-post")
            setIsSidebarOpen(false)
          }} className="py-3 px-4 hover:bg-gray-100 text-gray-700 cursor-pointer border-b">
            Добавить одежду
          </li>
          <li onClick={() => {
            router.push("/avatar")
            setIsSidebarOpen(false)
          }} className="py-3 px-4 hover:bg-gray-100 text-gray-700 cursor-pointer border-b">
            Поменять аватарку
          </li>
          <li onClick={() => {
            router.push("/login")
            setIsSidebarOpen(false)
          }} className="py-3 px-4 hover:bg-gray-100 text-gray-700 cursor-pointer border-b">
            Войти в аккаунт
          </li>
        </ul>
      </div>

      {/* Overlay (for closing sidebar on outside click) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Header;
