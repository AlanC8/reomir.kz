"use client";
import React, { useState } from "react";
import axios from "axios";
import apiClient from "../service/Interceptors";
import { useRouter } from "next/navigation";

const AvatarChange: React.FC = () => {
    const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Пожалуйста, выберите файл для загрузки");
      return;
    }

    const formData = new FormData();
    formData.append("icon", selectedFile);

    try {
      setLoading(true);
      const response = await apiClient.put(
        "/api/v1/user/icon",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      router.push("/profile");
      setMessage(response.data.message);
      setPreviewUrl(response.data.icon);
    } catch (error) {
      console.error("Ошибка загрузки аватарки:", error);
      setMessage("Ошибка при загрузке аватарки. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-[#2C964E] mb-4">
        Изменить аватарку
      </h2>

      {previewUrl && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-[#2C964E] file:text-white
          hover:file:bg-[#23813c]"
      />

      <button
        onClick={handleUpload}
        className={`w-full mt-4 py-2 px-4 text-white font-semibold rounded-lg transition duration-300 ${
          loading ? "bg-[#23813c] cursor-not-allowed" : "bg-[#2C964E] hover:bg-[#23813c]"
        }`}
        disabled={loading}
      >
        {loading ? "Загрузка..." : "Загрузить"}
      </button>

      {message && (
        <div className="mt-4 text-center text-sm text-gray-600">
          {message}
        </div>
      )}
    </div>
  );
};

export default AvatarChange;
