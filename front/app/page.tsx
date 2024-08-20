"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import Spinner from "./components/Spinner";
import apiClient from "./service/Interceptors";

interface Product {
  _id: string;
  title: string;
  photo: string[];
  brand: string;
  price: number;
  size: string;
  description: string;
  status: string;
}

const statusOrder = [
  "Новая с биркой",
  "Новая без бирки",
  "Надевалась один раз",
  "Надевалась несколько раз",
  "Есть дефекты",
  "На утиль"
];

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("Релевантности");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/api/v1/products"); // Замените на ваш API URL
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    if (selectedOption === "Состоянию") {
      const sortedProducts = [...products].sort(
        (a, b) =>
          statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
      );
      setProducts(sortedProducts);
    } else if (selectedOption === "Цене: по возрастанию") {
      const sortedProducts = [...products].sort((a, b) => a.price - b.price);
      setProducts(sortedProducts);
    } else if (selectedOption === "Цене: по убыванию") {
      const sortedProducts = [...products].sort((a, b) => b.price - a.price);
      setProducts(sortedProducts);
    } 
    // Можно добавить больше опций сортировки здесь.
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-2 justify-center items-center mt-[350px]">
        <Spinner />
        <p className="font-medium text-2xl">Загрузка...</p>
      </div>
    ); // Отображение сообщения при загрузке
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h2 className="font-semibold text-2xl text-[#2C964E]">Поиск</h2>
            <p className="text-sm text-gray-500 mt-1">
              Всего найдено: {products.length}
            </p>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <FaSortAmountDown className="text-gray-500 w-12 mr-2" />
              <label
                htmlFor="sort"
                className="block w-[120px] text-[12px] font-medium text-gray-700 mr-2"
              >
                Сортировать по:
              </label>
            </div>
            <select
              id="sort"
              name="sort"
              className="mt-1 block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="Релевантности" className="text-xs">Релевантности</option>
              <option value="Цене: по возрастанию" className="text-xs">Цене: по возрастанию</option>
              <option value="Цене: по убыванию" className="text-xs">Цене: по убыванию</option>
              <option value="Состоянию" className="text-xs">Состоянию</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid mb-16 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => router.push(`/product/${product._id}`)}
            className="bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative">
              <img
                src={product.photo[0]}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <span className="absolute top-2 right-2 bg-[#2C964E] text-white text-xs font-bold px-2 py-1 rounded">
                {product.status}
              </span>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {product.title}
            </h3>
            <p className="text-xs text-gray-500">{product.brand}</p>
            <p className="mt-1 text-sm text-[#2C964E] font-bold">
              ₸{product.price.toLocaleString("ru-RU")}
            </p>
            <p className="text-xs text-gray-500">Размер: {product.size}</p>
            <p
              className="mt-1 text-xs text-gray-700 overflow-hidden"
              style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
            >
              {product.description.length > 50 ? `${product.description.slice(0, 50)}...` : product.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
