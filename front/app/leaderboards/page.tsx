"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../service/Interceptors";

interface User {
  _id: string;
  email: string;
  username: string;
  city: string;
  icon: string;
  bonus: number;
  products: string[];
}

export default function LeaderBoard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get<User[]>("/api/v1/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Ошибка при получении списка пользователей:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center">Загрузка...</div>;
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="title text-center font-bold text-2xl p-5 text-gray-900">
        Лучшие 20 - Казахстан
      </div>
      <div className="m-auto flex flex-col gap-4 w-full max-w-md">
        {users.map((user, index) => (
          <div
            key={user._id}
            className="flex mx-4 bg-white rounded-lg shadow-lg p-4 items-center"
          >
            <div className="relative">
              <img
                src={user.icon}
                alt="Avatar"
                className="w-14 h-14 rounded-full"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.username || user.email}
                </h3>
                <span className="text-xs text-gray-500">{user.city}</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600">Отправлено</span>
                  <span className="text-md text-gray-800 font-semibold">
                    {user.products.length} шт
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600">Бонусы</span>
                  <span className="text-md text-gray-800 font-semibold">
                    {user.bonus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
