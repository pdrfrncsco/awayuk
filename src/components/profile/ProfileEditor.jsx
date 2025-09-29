import React, { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../common/Toast';

const ProfileEditor = ({ profileData, onSave, onCancel, isOwnProfile }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: profileData?.first_name || '',
    lastName: profileData?.last_name || '',
    profession: profileData?.profession || '',
    location: profileData?.location || '',
    category: profileData?.category || ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Design & Criatividade',
    'Tecnologia',
    'Consultoria',
    'Educação',
    'Saúde & Bem-estar',
    'Negócios & Finanças',
    'Marketing & Vendas',
    'Engenharia & Arquitetura',
    'Arte & Cultura',
    'Outros'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    if (!formData.profession.trim()) {
      newErrors.profession = 'Profissão é obrigatória';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Localização é obrigatória';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Por favor, corrija os erros no formulário.', 'error');
      return;
    }

    try {
      const updatedData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        profession: formData.profession.trim(),
        location: formData.location.trim(),
        category: formData.category
      };

      onSave(updatedData);
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao salvar perfil. Tente novamente.', 'error');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profileData?.first_name || '',
      lastName: profileData?.last_name || '',
      profession: profileData?.profession || '',
      location: profileData?.location || '',
      category: profileData?.category || ''
    });
    setErrors({});
    onCancel();
  };

  if (!isOwnProfile) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Editar Informações do Perfil
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <CheckIcon className="h-4 w-4 mr-1" />
            Salvar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite seu nome"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Sobrenome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sobrenome *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite seu sobrenome"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Profissão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profissão *
          </label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => handleInputChange('profession', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.profession ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Designer de Interiores, Desenvolvedor, Consultor..."
          />
          {errors.profession && (
            <p className="mt-1 text-sm text-red-600">{errors.profession}</p>
          )}
        </div>

        {/* Localização */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Londres, São Paulo, Lisboa..."
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;