"use client";
import React, { useEffect, useState } from "react";
import apiClient from "../service/Interceptors";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

interface Product {
  id: string;
  title: string;
  photo: string[];
  brand: string;
  price: number;
  size: string;
  description: string;
  status: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  city: string;
  icon: string;
  bonus: number;
  products: Product[];
}

const Profile: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const Map = dynamic(() => import("../components/Map"), { ssr: false });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/api/v1/auth/me");
        setUser(response.data);
        // Проверка на наличие продуктов со статусом "На утиль" или "Есть дефекты"
        const hasDefectiveProduct = response.data.products.some(
          (product: Product) => product.status === "На утиль" || product.status === "Есть дефекты"
        );
        if (hasDefectiveProduct) {
          setIsModalOpen(true); // Открываем модальное окно, если такие продукты есть
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Пользователь не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Раздел с информацией о пользователе */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={user.icon}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-200"
          />
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">
              {user.username || user.email}
            </h2>
            <p className="text-gray-600 mt-2">{user.city}</p>
            <p className="text-green-600 mt-2 text-lg font-medium">
              Бонусы: {user.bonus}
            </p>
          </div>
        </div>
      </div>

      {/* Раздел с объявлениями пользователя */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Мои объявления
        </h3>
        <div className="grid mb-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {user.products.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={product.photo[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.status}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="mt-2 text-xl font-bold text-green-600">
                  ₸{product.price.toLocaleString("ru-RU")}
                </p>
                <p className="text-sm text-gray-500">Размер: {product.size}</p>
                <p className="mt-4 text-sm text-gray-600">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed text-center inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-white h-[350px] rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-8">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              x
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#2C964E]">
              Есть продукты с дефектами!
            </h2>
            <p className="mb-4">
              У вас есть товары со статусом &quot;На утиль&quot; или &quot;Есть дефекты&quot;.
              Вы можете их сдать на переработку или для благотворительности и получить бонусы.
              За это вы сможете подняться в списке топ пользователей Казахстана!
            </p>
            <div className="h-64">
                <button onClick={() => router.push("/map")} className="bg-[#2C964E] text-white font-medium py-2 px-4 rounded text-sm">Поддерживать благие инициативы</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
