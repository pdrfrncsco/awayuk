import React, { useState } from 'react';
import { useToast } from '../common/Toast';

const PortfolioManager = ({ portfolio, onSave, onCancel, isOwnProfile }) => {
  const { showToast } = useToast();
  const [portfolioList, setPortfolioList] = useState(portfolio || []);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    imageFile: null,
    completedDate: '',
    client: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Residencial',
    'Comercial',
    'Industrial',
    'Outro'
  ];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      imageFile: null,
      completedDate: '',
      client: ''
    });
    setErrors({});
    setEditingProject(null);
    setShowForm(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título do projeto é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    // Para novos projetos, a imagem de ficheiro é obrigatória (backend ImageField)
    if (!editingProject && !formData.imageFile) {
      newErrors.image = 'Imagem é obrigatória (carregue um ficheiro)';
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
      showToast('Por favor, corrija os erros no formulário.', 'error');
      return;
    }

    try {
      const projectData = {
        ...formData,
        id: editingProject ? editingProject.id : Date.now()
      };

      if (editingProject) {
        // Editar projeto existente
        setPortfolioList(prev => 
          prev.map(project => 
            project.id === editingProject.id ? projectData : project
          )
        );
        showToast('Projeto atualizado com sucesso!', 'success');
      } else {
        // Adicionar novo projeto
        setPortfolioList(prev => [...prev, projectData]);
        showToast('Projeto adicionado com sucesso!', 'success');
      }

      resetForm();
    } catch (error) {
      showToast('Erro ao salvar projeto. Tente novamente.', 'error');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image || '',
      imageFile: project.imageFile || null,
      completedDate: project.completedDate || '',
      client: project.client || ''
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        setPortfolioList(prev => prev.filter(project => project.id !== projectId));
        showToast('Projeto excluído com sucesso!', 'success');
      } catch (error) {
        showToast('Erro ao excluir projeto. Tente novamente.', 'error');
      }
    }
  };

  const handleSave = () => {
    onSave(portfolioList);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {isOwnProfile ? 'Gerenciar Portfólio' : 'Portfólio'}
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
                  Adicionar Projeto
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

      {/* Formulário de Adicionar/Editar Projeto */}
      {showForm && isOwnProfile && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingProject ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Projeto
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Reforma de Apartamento Moderno"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
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
                placeholder="Descreva o projeto realizado..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente (opcional)
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Nome do cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Conclusão (opcional)
                </label>
                <input
                  type="date"
                  value={formData.completedDate}
                  onChange={(e) => handleInputChange('completedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem do Projeto (ficheiro obrigatório para novos projetos)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange('imageFile', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.image ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProject ? 'Atualizar' : 'Adicionar'} Projeto
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

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioList.map(project => (
          <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img 
              src={project.image || "https://picsum.photos/400/300?random=" + project.id} 
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                    {isOwnProfile && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Editar"
                        >
                          <i className="fas fa-edit text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Excluir"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  
                  {project.client && (
                    <p className="text-xs text-gray-500 mb-1">
                      <i className="fas fa-user mr-1"></i>
                      Cliente: {project.client}
                    </p>
                  )}
                  
                  {project.completedDate && (
                    <p className="text-xs text-gray-500">
                      <i className="fas fa-calendar mr-1"></i>
                      Concluído em: {new Date(project.completedDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolioList.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">
            {isOwnProfile ? 'Nenhum projeto adicionado ainda.' : 'Nenhum projeto disponível.'}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Adicionar Primeiro Projeto
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;