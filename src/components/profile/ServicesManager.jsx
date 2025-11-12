import React, { useState } from 'react';
import { useToast } from '../common/Toast';
import VisitorAction from '../auth/VisitorAction';

const ServicesManager = ({ services, onSave, onCancel, isOwnProfile }) => {
  const { showToast } = useToast();
  const [servicesList, setServicesList] = useState(services || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      image: ''
    });
    setErrors({});
    setEditingService(null);
    setShowForm(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do serviço é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duração é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
      showToast('Por favor, corrija os erros no formulário', 'error');
      return;
    }

    const serviceData = {
      ...formData,
      id: editingService ? editingService.id : Date.now()
    };

    if (editingService) {
      // Editar serviço existente
      setServicesList(prev => 
        prev.map(service => 
          service.id === editingService.id ? serviceData : service
        )
      );
      showToast('Serviço atualizado com sucesso!', 'success');
    } else {
      // Adicionar novo serviço
      setServicesList(prev => [...prev, serviceData]);
      showToast('Serviço adicionado com sucesso!', 'success');
    }

    resetForm();
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image: service.image || ''
    });
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        setServicesList(prev => prev.filter(service => service.id !== serviceId));
        showToast('Serviço excluído com sucesso!', 'success');
      } catch (error) {
        showToast('Erro ao excluir serviço. Tente novamente.', 'error');
      }
    }
  };

  const handleSave = () => {
    onSave(servicesList);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {isOwnProfile ? 'Gerenciar Serviços' : 'Serviços'}
        </h3>
        <div className="flex space-x-2">
          {isOwnProfile && (
            <>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Adicionar Serviço
                </button>
              )}
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </>
          )}
        </div>
      </div>

      {/* Formulário de Adicionar/Editar Serviço */}
      {showForm && isOwnProfile && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingService ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Consultoria de Design"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: £50/hora"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descreva o serviço oferecido..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 2 horas"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem (opcional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingService ? 'Atualizar' : 'Adicionar'} Serviço
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map(service => (
          <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <img 
              src={service.image || "https://picsum.photos/400/200?random=" + service.id} 
              alt={service.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
                {isOwnProfile && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Editar"
                    >
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Excluir"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-red-600">{service.price}</span>
                <span className="text-sm text-gray-500">
                  <i className="fas fa-clock mr-1"></i>
                  {service.duration}
                </span>
              </div>
              {!isOwnProfile && (
                <VisitorAction
                  onAction={() => {
                    setSelectedService(service);
                    setShowRequestModal(true);
                  }}
                  showModal={true}
                  redirectTo="/login"
                  requireMember={false}
                  actionType="message"
                >
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity">
                    Solicitar Orçamento
                  </button>
                </VisitorAction>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Solicitação de Orçamento */}
      {showRequestModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Solicitar Orçamento - {selectedService.name}
              </h4>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowRequestModal(false)}
                aria-label="Fechar"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Descreva brevemente o que precisa para que o prestador possa estimar o orçamento.
              </p>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Preciso de um website com 5 páginas, integração com formulário de contacto, e prazo de 3 semanas."
              />
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowRequestModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => {
                  if (!requestMessage.trim()) {
                    showToast('Por favor, descreva o pedido para o orçamento.', 'error');
                    return;
                  }
                  // Placeholder: enviar pedido ao backend
                  console.log('Pedido de orçamento enviado:', {
                    serviceId: selectedService.id,
                    serviceName: selectedService.name,
                    message: requestMessage
                  });
                  showToast('Pedido de orçamento enviado!', 'success');
                  setShowRequestModal(false);
                  setRequestMessage('');
                  setSelectedService(null);
                }}
              >
                Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {servicesList.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-briefcase text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">
            {isOwnProfile ? 'Nenhum serviço adicionado ainda.' : 'Nenhum serviço disponível.'}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Adicionar Primeiro Serviço
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesManager;