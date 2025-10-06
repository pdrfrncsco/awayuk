import React, { useState, useEffect } from 'react';
import {
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  EyeIcon,
  TrashIcon,
  DownloadIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ApiClient } from '../../services';
import useFileUpload from '../../hooks/useFileUpload';

const FileGallery = ({ 
  onFileSelect = null,
  selectable = false,
  multiple = false,
  fileTypes = null,
  category = null,
  showUpload = true
}) => {
  const apiClient = new ApiClient();
  const { formatFileSize } = useFileUpload();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [category, filterType]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (filterType !== 'all') params.file_type = filterType;
      if (searchTerm) params.search = searchTerm;

      const data = await apiClient.get('/uploads/files/', { params });
      setFiles(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = (file) => {
    if (selectable) {
      if (multiple) {
        setSelectedFiles(prev => {
          const isSelected = prev.find(f => f.id === file.id);
          if (isSelected) {
            return prev.filter(f => f.id !== file.id);
          } else {
            return [...prev, file];
          }
        });
      } else {
        setSelectedFiles([file]);
        onFileSelect?.(file);
      }
    } else {
      setPreviewFile(file);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return;

    try {
      await apiClient.delete(`/uploads/files/${fileId}/`);
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      const blob = await apiClient.get(`/uploads/files/${file.id}/download/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.original_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  const getFileIcon = (fileType) => {
    const iconClass = "h-8 w-8 text-gray-400";
    
    switch (fileType) {
      case 'image':
        return <PhotoIcon className={iconClass} />;
      case 'video':
        return <VideoCameraIcon className={iconClass} />;
      case 'audio':
        return <MusicalNoteIcon className={iconClass} />;
      case 'archive':
        return <ArchiveBoxIcon className={iconClass} />;
      default:
        return <DocumentIcon className={iconClass} />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileTypes ? fileTypes.includes(file.file_type) : true;
    return matchesSearch && matchesType;
  });

  const FileCard = ({ file }) => {
    const isSelected = selectedFiles.find(f => f.id === file.id);
    
    return (
      <div
        className={`
          relative group cursor-pointer rounded-lg border-2 transition-all duration-200
          ${isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }
        `}
        onClick={() => handleFileClick(file)}
      >
        {/* File Preview */}
        <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-50">
          {file.file_type === 'image' ? (
            <img
              src={file.file_url}
              alt={file.alt_text || file.original_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getFileIcon(file.file_type)}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {file.title || file.original_name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {formatFileSize(file.file_size)} • {file.file_type}
          </p>
        </div>

        {/* Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewFile(file);
            }}
            className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            title="Visualizar"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadFile(file);
            }}
            className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            title="Baixar"
          >
            <DownloadIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFile(file.id);
            }}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Excluir"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Selection Indicator */}
        {selectable && isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
            ✓
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Galeria de Arquivos
        </h2>
        
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4" />
          </button>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {['all', 'image', 'document', 'video', 'audio', 'archive'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? 'Todos' : type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Files Info */}
      {selectable && selectedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            {selectedFiles.length} arquivo(s) selecionado(s)
          </p>
          {multiple && (
            <button
              onClick={() => onFileSelect?.(selectedFiles)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Usar Selecionados
            </button>
          )}
        </div>
      )}

      {/* Files Grid/List */}
      {filteredFiles.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
            : 'space-y-2'
        }>
          {filteredFiles.map(file => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PhotoIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum arquivo encontrado
          </h3>
          <p className="text-sm text-gray-600">
            {searchTerm ? 'Tente ajustar sua busca' : 'Faça upload de alguns arquivos para começar'}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {previewFile.title || previewFile.original_name}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              {previewFile.file_type === 'image' ? (
                <img
                  src={previewFile.file_url}
                  alt={previewFile.alt_text || previewFile.original_name}
                  className="max-w-full max-h-96 object-contain mx-auto"
                />
              ) : (
                <div className="text-center py-8">
                  {getFileIcon(previewFile.file_type)}
                  <p className="mt-2 text-sm text-gray-600">
                    Visualização não disponível para este tipo de arquivo
                  </p>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Tamanho:</strong> {formatFileSize(previewFile.file_size)}</p>
                <p><strong>Tipo:</strong> {previewFile.file_type}</p>
                <p><strong>Enviado em:</strong> {new Date(previewFile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileGallery;