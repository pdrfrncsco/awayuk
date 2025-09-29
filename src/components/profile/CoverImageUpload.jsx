import React, { useState } from 'react';
import {
  PhotoIcon,
  CameraIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const CoverImageUpload = ({ 
  currentImage, 
  onImageUpdate,
  height = 'h-48'
}) => {
  const { token, user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB para foto de capa
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!acceptedTypes.includes(file.type)) {
      return 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
    }
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 10MB';
    }
    return null;
  };

  const handleFileSelect = async (file) => {
    setError('');
    setSuccess('');

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', 'Foto de capa');
      formData.append('alt_text', `Foto de capa de ${user?.first_name || user?.username}`);
      formData.append('is_public', 'true');

      const response = await fetch('http://127.0.0.1:8000/api/uploads/files/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro no upload');
      }

      const result = await response.json();
      
      // Update user profile with new cover image
      await updateUserProfile(result.id);
      
      setSuccess('Foto de capa atualizada com sucesso!');
      onImageUpdate?.(result);
      
      // Clear preview after success
      setTimeout(() => {
        setPreview(null);
        setSuccess('');
      }, 3000);

    } catch (error) {
      setError(error.message);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const updateUserProfile = async (imageId) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cover_image: imageId
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearPreview = () => {
    setPreview(null);
    setError('');
    setSuccess('');
  };

  const displayImage = preview || currentImage;

  return (
    <div className="relative w-full">
      {/* Cover Image Container */}
      <div className="relative group">
        <div
          className={`
            w-full ${height} rounded-lg overflow-hidden border-2 border-gray-200
            group-hover:border-blue-300 transition-colors duration-200 cursor-pointer
            ${uploading ? 'opacity-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt="Foto de capa"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <PhotoIcon className="h-16 w-16 text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Upload Button Overlay */}
        <label
          htmlFor="cover-image-upload"
          className={`
            absolute inset-0 flex items-center justify-center
            bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100
            transition-opacity duration-200 cursor-pointer
            ${uploading ? 'opacity-100' : ''}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-white text-sm">Enviando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <CameraIcon className="h-8 w-8 text-white" />
              <span className="text-white text-sm">Alterar foto de capa</span>
            </div>
          )}
        </label>

        {/* Clear Preview Button */}
        {preview && (
          <button
            onClick={clearPreview}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}

        <input
          id="cover-image-upload"
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          disabled={uploading}
        />
      </div>

      {/* Upload Instructions */}
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600">
          Clique na imagem para alterar a foto de capa
        </p>
        <p className="text-xs text-gray-500">
          JPEG, PNG ou WebP até 10MB • Recomendado: 1200x400px
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-3 flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}
    </div>
  );
};

export default CoverImageUpload;