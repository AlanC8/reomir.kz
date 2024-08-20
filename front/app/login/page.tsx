"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserService } from "../service/UserService";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Пожалуйста, введите email и пароль");
      return;
    }

    try {
      const response = await UserService.getInstance().login(email, password);

      if (response.status === 200) {
        console.log("Успешный вход");
        router.push("/");
        if (window !== undefined) {
          localStorage.setItem("access", response.data.accessToken);
        }
      } else {
        setError("Неправильный email или пароль");
      }
    } catch (error) {
      setError("Произошла ошибка во время входа");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#2C964E] p-4">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-white bg-opacity-90">
        <div className="text-center text-2xl font-bold text-[#2C964E] mb-4">
          BREVNOKZ
        </div>
        <h1 className="text-xl font-bold text-[#2C964E] mb-4 text-center">
          С возвращением!
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#2C964E] sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#2C964E] sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#2C964E] text-white font-semibold rounded-md shadow-sm hover:bg-[#1a3a22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C964E]"
          >
            Вход
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Нет аккаунта?{" "}
            <Link
              href="/auth/register"
              className="text-[#2C964E] font-semibold"
            >
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
