import React, { useState } from 'react';
import {
  UserCircleIcon,
  CameraIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const ProfileImageUpload = ({ 
  currentImage, 
  onImageUpdate, 
  size = 'large' 
}) => {
  const { token, user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-48 h-48'
  };

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6',
    xlarge: 'h-8 w-8'
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!acceptedTypes.includes(file.type)) {
      return 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
    }
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 5MB';
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
      formData.append('title', 'Foto de perfil');
      formData.append('alt_text', `Foto de perfil de ${user?.first_name || user?.username}`);
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
      
      // Update user profile with new image
      await updateUserProfile(result.id);
      
      setSuccess('Foto de perfil atualizada com sucesso!');
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
          profile_image: imageId
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
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Image Container */}
      <div className="relative group">
        <div
          className={`
            ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-gray-200
            group-hover:border-blue-300 transition-colors duration-200 cursor-pointer
            ${uploading ? 'opacity-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <UserCircleIcon className={`${sizeClasses[size]} text-gray-400`} />
            </div>
          )}
        </div>

        {/* Upload Button Overlay */}
        <label
          htmlFor="profile-image-upload"
          className={`
            absolute inset-0 flex items-center justify-center
            bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100
            transition-opacity duration-200 cursor-pointer
            ${uploading ? 'opacity-100' : ''}
          `}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <CameraIcon className={`${iconSizes[size]} text-white`} />
          )}
        </label>

        {/* Clear Preview Button */}
        {preview && (
          <button
            onClick={clearPreview}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}

        <input
          id="profile-image-upload"
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          disabled={uploading}
        />
      </div>

      {/* Upload Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Clique na imagem para alterar
        </p>
        <p className="text-xs text-gray-500">
          JPEG, PNG ou WebP até 5MB
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-2 bg-red-50 border border-red-200 rounded-lg max-w-xs">
          <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center p-2 bg-green-50 border border-green-200 rounded-lg max-w-xs">
          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <p className="text-xs text-green-700">{success}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;