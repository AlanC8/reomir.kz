"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";
import apiClient from "../service/Interceptors";
import Spinner from "../components/Spinner";
import { useRouter } from "next/navigation";

const PostClothes: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      setImages((prevImages) => [...prevImages, ...uploadedFiles].slice(0, 3)); // Limit to 3 images
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const loadingMessages = [
    "ИИ определяет качество одежды...",
    "Загрузка изображений...",
    "Проверяем размер...",
    "Завершаем процесс..."
  ];

  useEffect(() => {
    if (isLoading) {
      let index = 0;
      setLoadingMessage(loadingMessages[index]);
      const intervalId = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 2000);

      return () => clearInterval(intervalId); // Очистка интервала при завершении загрузки
    }
  }, [isLoading]);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("size", size);
    formData.append("description", description);

    images.forEach((image, index) => {
      if (index === 0) {
        formData.append("first_pic", image);
      } else if (index === 1) {
        formData.append("second_pic", image);
      } else if (index === 2) {
        formData.append("third_pic", image);
      }
    });

    try {
      setIsLoading(true);

      const response = await apiClient.post("/api/v1/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setLoadingMessage("Загрузка завершена!");
        console.log("Product uploaded successfully:", response.data);
        setTimeout(() => {
          setIsLoading(false);
          router.push("/profile"); // Перенаправление на страницу профиля
        }, 2000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Request failed:", error);

      if (error.response && error.response.status === 401) {
        router.push("/login"); // Перенаправление на страницу входа
      } else {
        alert("Произошла ошибка при загрузке продукта. Пожалуйста, попробуйте снова.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto h-[90vh] p-6 rounded-lg shadow-md bg-white overflow-y-scroll">
      <h2 className="text-lg font-bold mb-4">Создайте объявление</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Фото
        </label>
        <div className="border-2 flex flex-col items-center justify-center min-h-[200px] rounded-lg border-dashed border-gray-300 p-4 text-center bg-gray-50">
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-pink-600 hover:text-pink-800 flex items-center justify-center gap-2 text-sm font-medium mb-2"
          >
            <FaPlus />
            Загрузите фото
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-gray-700 text-white rounded-full p-1 text-xs"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-gray-500 text-xs mt-2">
            Число файлов: {images.length}/3
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Название
        </label>
        <input
          type="text"
          placeholder="Топ от Louis Vuitton"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Бренд
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
          style={{
            boxSizing: "border-box",
            maxHeight: "150px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option>Выберите бренд одежды</option>
          <option>QREP</option>
          <option>Koton</option>
          <option>Uniqlo</option>
          <option>Massimo Dutti</option>
          <option>H&M</option>
          <option>Zara</option>
          <option>Bershka</option>
          <option>Pull&Bear</option>
          <option>Mango</option>
          <option>LC Waikiki</option>
          <option>Boss</option>
          <option>Adidas</option>
          <option>Nike</option>
        </select>
      </div>

      <div className="flex justify-between gap-4 mb-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цена
          </label>
          <input
            type="text"
            placeholder="Цена"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Размер
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option>Выберите размер одежды</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Описание
        </label>
        <textarea
          placeholder="Описание товара"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <p className="text-xs text-gray-500">
        Состояние товара будет проверено с помощью искусственного интеллекта.
        Если возникнут неприятности, обращайтесь на reomir.kz
      </p>

      <button
        className="w-full bg-[#2C964E] text-white font-medium py-2 rounded my-4"
        onClick={handleSubmit}
      >
        Загрузить
      </button>

      {/* Модалка для отображения процесса загрузки */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Spinner />
            <p className="mt-4 text-lg font-medium text-gray-700">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostClothes;
