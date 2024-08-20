"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/app/service/Interceptors";
import Spinner from "../../components/Spinner";

interface User {
  _id: string;
  email: string;
  username: string;
}

interface Product {
  _id: string;
  title: string;
  photo: string[];
  brand: string;
  price: number;
  size: string;
  description: string;
  status: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [category, setCategory] = useState("upper_body");
  const [isTryingOn, setIsTryingOn] = useState(false);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await apiClient.get<Product>(
            `/api/v1/product/${id}`
          );
          setProduct(response.data);
          setMainImage(response.data.photo[0]);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
  };

  const handleTryOnClick = async () => {
    setIsTryingOn(true);
    setTryOnResult(null);

    try {
      const response = await apiClient.post("/api/v1/product/vton", {
        garm_img: mainImage,
        category,
      });

      if (response.data.output) {
        setTryOnResult(response.data.output);
        setIsModalOpen(true);
      } else {
        console.error("No output received from the server.");
      }
    } catch (error) {
      console.error("Error during try-on:", error);
    } finally {
      setIsTryingOn(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!product) {
    return <div className="text-center">Продукт не найден</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      {" "}
      {/* Добавлен padding внизу */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <div
            className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={mainImage || ""}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {product.photo.map((photo, index) => (
              <div
                key={index}
                className={`w-1/2 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer ${
                  mainImage === photo ? "border-2 border-[#2C964E]" : ""
                }`}
                onClick={() => handleThumbnailClick(photo)}
              >
                <img
                  src={photo}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-[#2C964E]">
          {product.title}
        </h1>
        <p className="text-lg text-gray-500 mb-4">{product.brand}</p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-4xl text-[#2C964E] font-bold">
            ₸{product.price.toLocaleString("ru-RU")}
          </span>
          <span className="text-2xl font-semibold bg-gray-100 px-2 py-1 rounded-md">
            {product.size}
          </span>
        </div>

        <div className="mb-4 text-lg">
          <p className="text-sm">
            <span className="font-semibold">Продавец: </span>
            <span className="text-[#2C964E]">{product.user.username}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Состояние: </span>
            <span className="text-[#2C964E]">{product.status}</span>
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-[#2C964E]">Описание</h2>
          <p className="text-base text-gray-700">{product.description}</p>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Выберите категорию для примерки:
          </label>
          <select
            className="w-full py-2 px-3 border border-gray-300 rounded-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="upper_body">Верхняя одежда</option>
            <option value="lower_body">Нижняя одежда</option>
            <option value="dress">Платье</option>
          </select>
        </div>

        <div className="mt-6">
          <button
            onClick={handleTryOnClick}
            className={`w-full py-3 px-4 text-white text-lg font-semibold rounded-lg transition duration-300 ${
              isTryingOn
                ? "bg-[#23813c] cursor-not-allowed"
                : "bg-[#2C964E] hover:bg-[#23813c]"
            }`}
            disabled={isTryingOn}
          >
            {isTryingOn ? "Примерка..." : "Примерить на себе"}
          </button>
        </div>
      </div>
      {isTryingOn && (
        <div className="fixed inset-0 bg-black bg-opacity-55 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
      {/* Показываем спиннер во время примерки */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-11/12 h-3/4 bg-white p-4 rounded-lg overflow-hidden">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              Закрыть
            </button>
            {tryOnResult ? (
              <img
                src={tryOnResult}
                alt="Try-On Result"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-lg">Загрузка результата...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
