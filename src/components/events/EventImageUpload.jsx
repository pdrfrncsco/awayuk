import React, { useState } from 'react';
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { ApiClient } from '../../services';

const EventImageUpload = ({ 
  eventId,
  existingImages = [],
  onImagesUpdate,
  maxImages = 5,
  featured = false
}) => {
  const apiClient = new ApiClient();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(existingImages);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateFile = (file) => {
    const maxSize = 1 * 1024 * 1024; // 10MB for events
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!acceptedTypes.includes(file.type)) {
      return 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
    }
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 1MB';
    }
    return null;
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', `Imagem do evento ${eventId || 'novo'}`);
    formData.append('alt_text', 'Imagem do evento');
    formData.append('is_public', 'true');

    try {
      return await apiClient.upload('/uploads/files/upload/', formData);
    } catch (error) {
      throw error;
    }
  };

  const handleFileSelect = async (files) => {
    setError('');
    setSuccess('');
    
    const fileList = Array.from(files);
    const remainingSlots = maxImages - images.length;
    
    if (fileList.length > remainingSlots) {
      setError(`Você pode adicionar apenas ${remainingSlots} imagem(ns) a mais.`);
      return;
    }

    // Validate all files first
    for (const file of fileList) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploading(true);

    try {
      const uploadPromises = fileList.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages = [...images, ...results];
      setImages(newImages);
      setSuccess(`${results.length} imagem(ns) adicionada(s) com sucesso!`);
      onImagesUpdate?.(newImages);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    onImagesUpdate?.(updatedImages);
  };

  const setFeaturedImage = (imageId) => {
    const updatedImages = images.map(img => ({
      ...img,
      is_featured: img.id === imageId
    }));
    setImages(updatedImages);
    onImagesUpdate?.(updatedImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-6">
      {/* Current Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={image.file_url}
                  alt={image.alt_text || 'Imagem do evento'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                {featured && (
                  <button
                    onClick={() => setFeaturedImage(image.id)}
                    className={`p-2 rounded-full transition-colors ${
                      image.is_featured 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-yellow-100'
                    }`}
                    title={image.is_featured ? 'Imagem destacada' : 'Definir como destacada'}
                  >
                    ⭐
                  </button>
                )}
                
                <button
                  onClick={() => removeImage(image.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remover imagem"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              
              {/* Featured Badge */}
              {image.is_featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Destacada
                </div>
              )}
              
              {/* Image Index */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('event-images-upload')?.click()}
        >
          <input
            id="event-images-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileInputChange}
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600">Enviando imagens...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <PlusIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Adicionar Imagens
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Clique para selecionar ou arraste imagens aqui
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP até 10MB • {images.length}/{maxImages} imagens
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      {images.length === 0 && (
        <div className="text-center py-8">
          <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma imagem adicionada
          </h3>
          <p className="text-sm text-gray-600">
            Adicione imagens para tornar seu evento mais atrativo
          </p>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Dicas para melhores imagens:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use imagens de alta qualidade (mínimo 800x600px)</li>
          <li>• A primeira imagem será usada como capa do evento</li>
          <li>• Evite imagens com muito texto</li>
          <li>• Prefira imagens que mostrem o ambiente ou atividade do evento</li>
        </ul>
      </div>
    </div>
  );
};

export default EventImageUpload;