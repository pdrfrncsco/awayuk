import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useFileUpload = () => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file, options = {}) => {
    const {
      endpoint = '/api/uploads/files/upload/',
      title = '',
      description = '',
      altText = '',
      category = null,
      isPublic = true,
      onProgress = null
    } = options;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);
      if (altText) formData.append('alt_text', altText);
      if (category) formData.append('category', category);
      formData.append('is_public', isPublic.toString());

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setProgress(percentComplete);
            onProgress?.(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (e) {
              reject(new Error('Erro ao processar resposta do servidor'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.detail || `Erro HTTP ${xhr.status}`));
            } catch (e) {
              reject(new Error(`Erro HTTP ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Erro de rede durante o upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelado'));
        });

        xhr.open('POST', `http://127.0.0.1:8000${endpoint}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [token]);

  const uploadMultipleFiles = useCallback(async (files, options = {}) => {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFile(files[i], {
          ...options,
          onProgress: (progress) => {
            const totalProgress = ((i / files.length) + (progress / 100 / files.length)) * 100;
            setProgress(totalProgress);
            options.onProgress?.(totalProgress, i, files.length);
          }
        });
        results.push(result);
      } catch (error) {
        errors.push({ file: files[i], error: error.message });
      }
    }

    if (errors.length > 0) {
      const errorMessage = `${errors.length} arquivo(s) falharam no upload`;
      setError(errorMessage);
    }

    return { results, errors };
  }, [uploadFile]);

  const validateFile = useCallback((file, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions = null
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return `Arquivo muito grande. Tamanho máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }

    // Check MIME type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return `Tipo de arquivo não suportado. Tipos permitidos: ${allowedTypes.join(', ')}`;
    }

    // Check file extension
    if (allowedExtensions) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return `Extensão não suportada. Extensões permitidas: ${allowedExtensions.join(', ')}`;
      }
    }

    return null;
  }, []);

  const validateFiles = useCallback((files, options = {}) => {
    const errors = [];
    
    for (const file of files) {
      const error = validateFile(file, options);
      if (error) {
        errors.push({ file, error });
      }
    }

    return errors;
  }, [validateFile]);

  const getFilePreview = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Arquivo não é uma imagem'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    // State
    uploading,
    progress,
    error,
    
    // Functions
    uploadFile,
    uploadMultipleFiles,
    validateFile,
    validateFiles,
    getFilePreview,
    formatFileSize,
    reset
  };
};

export default useFileUpload;