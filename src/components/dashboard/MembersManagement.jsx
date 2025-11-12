import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { membersService } from '../../services';
import { getProfileImageUrl } from '../../utils/getProfileImageUrl';

const MembersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Modal e Formulário de CRUD
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    profession: '',
    company: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    skills: [],
    interests: [],
    status: 'active',
    role: 'member'
  });

  const openAddMemberModal = () => {
    setEditingMember(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      profession: '',
      company: '',
      bio: '',
      website: '',
      linkedin: '',
      twitter: '',
      skills: [],
      interests: [],
      status: 'active',
      role: 'member'
    });
    setShowFormModal(true);
  };

  const openEditMemberModal = (member) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      phone: member.phone || '',
      location: member.location || '',
      profession: member.profession || '',
      company: member.company || '',
      bio: member.bio || '',
      website: member.website || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      skills: member.skills || [],
      interests: member.interests || [],
      status: member.status || 'active',
      role: member.role || 'member'
    });
    setShowFormModal(true);
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsInputChange = (name, value) => {
    const arr = value
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);
    setFormData(prev => ({ ...prev, [name]: arr }));
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingMember(null);
  };

  // Carregar membros
  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        role: filterRole !== 'all' ? filterRole : undefined,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await membersService.getMembers(filters);
      setMembers(response.results);
      setPagination(prev => ({
        ...prev,
        total: response.count,
        totalPages: Math.ceil(response.count / prev.limit)
      }));
    } catch (err) {
      console.error('Erro ao carregar membros:', err);
      setError('Erro ao carregar membros. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadMembers();
  }, [pagination.page, pagination.limit]);

  // Efeito para busca e filtros (com debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadMembers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, filterRole]);

  // Alternar status do membro
  const toggleMemberStatus = async (memberId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await membersService.toggleMemberStatus(memberId, newStatus === 'active');
      
      // Atualizar lista local
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, status: newStatus }
          : member
      ));
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      setError('Erro ao alterar status do membro.');
    }
  };

  // Deletar membro
  const deleteMember = async (memberId) => {
    if (!window.confirm('Tem certeza que deseja deletar este membro?')) {
      return;
    }

    try {
      await membersService.deleteMember(memberId);
      setMembers(prev => prev.filter(member => member.id !== memberId));
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    } catch (err) {
      console.error('Erro ao deletar membro:', err);
      setError('Erro ao deletar membro.');
    }
  };

  // Exportar dados
  const exportMembers = async () => {
    try {
      const filters = {
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        role: filterRole !== 'all' ? filterRole : undefined
      };
      const blob = await membersService.exportMembers(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'members_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao exportar dados:', err);
      setError('Erro ao exportar dados.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      inactive: { color: 'bg-red-100 text-red-800', label: 'Inativo' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
      moderator: { color: 'bg-blue-100 text-blue-800', label: 'Moderador' },
      member: { color: 'bg-gray-100 text-gray-800', label: 'Membro' }
    };
    
    const config = roleConfig[role] || roleConfig.member;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id));
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Dispensar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Membros</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie todos os membros da comunidade AWAYSUK
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            onClick={exportMembers}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
            Exportar
          </button>
          <button
            type="button"
            onClick={openAddMemberModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Adicionar Membro
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Pesquisar membros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                Filtros
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="pending">Pendentes</option>
                    <option value="inactive">Inativos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Função</label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todas</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderador</option>
                    <option value="member">Membro</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Membros ({pagination.total})
            </h3>
            {selectedMembers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {selectedMembers.length} selecionados
                </span>
                <button className="text-sm text-red-600 hover:text-red-900">
                  Ações em lote
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Carregando membros...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedMembers.length === members.length && members.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Função
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Registo
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => handleSelectMember(member.id)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={getProfileImageUrl({ profile_image: member.profile_image, avatar: member.avatar, name: member.name })}
                                alt={member.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.profession}</div>
                              <div className="text-xs text-gray-400">{member.company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {member.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {member.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {member.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleMemberStatus(member.id, member.status)}
                            className="cursor-pointer"
                          >
                            {getStatusBadge(member.status)}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(member.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {new Date(member.joinDate).toLocaleDateString('pt-PT')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => openEditMemberModal(member)} className="text-red-600 hover:text-red-900">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteMember(member.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {members.length === 0 && (
                <div className="text-center py-12">
                  <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum membro encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tente ajustar os filtros ou termos de pesquisa.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                        {' '}a{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{pagination.total}</span>
                        {' '}resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        {[...Array(pagination.totalPages)].map((_, index) => {
                          const page = index + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === pagination.page
                                  ? 'z-10 bg-red-50 border-red-500 text-red-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Próximo
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-40" onClick={closeFormModal}></div>
            <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingMember ? 'Editar Membro' : 'Adicionar Membro'}
                </h3>
                <button onClick={closeFormModal} className="text-gray-500 hover:text-gray-700">Fechar</button>
              </div>
              <div className="px-6 py-4">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setSaving(true);
                    setError(null);
                    const payload = { ...formData };
                    let saved;
                    if (editingMember) {
                      saved = await membersService.updateMember(editingMember.id, payload);
                      setMembers(prev => prev.map(m => m.id === editingMember.id ? saved : m));
                    } else {
                      saved = await membersService.createMember(payload);
                      // Inserir no topo e atualizar totais
                      setMembers(prev => [saved, ...prev]);
                      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
                    }
                    setShowFormModal(false);
                    setEditingMember(null);
                  } catch (err) {
                    console.error('Erro ao salvar membro:', err);
                    setError('Erro ao salvar membro. Verifique os dados e tente novamente.');
                  } finally {
                    setSaving(false);
                  }
                }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Primeiro Nome</label>
                      <input name="firstName" value={formData.firstName} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Último Nome</label>
                      <input name="lastName" value={formData.lastName} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" required name="email" value={formData.email} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefone</label>
                      <input name="phone" value={formData.phone} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Localização</label>
                      <input name="location" value={formData.location} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profissão</label>
                      <input name="profession" value={formData.profession} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Empresa</label>
                      <input name="company" value={formData.company} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea name="bio" rows={3} value={formData.bio} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <input name="website" value={formData.website} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                      <input name="linkedin" value={formData.linkedin} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Twitter</label>
                      <input name="twitter" value={formData.twitter} onChange={handleFormInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Skills (separadas por vírgula)</label>
                      <input value={formData.skills.join(', ')} onChange={(e) => handleTagsInputChange('skills', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interesses (separados por vírgula)</label>
                      <input value={formData.interests.join(', ')} onChange={(e) => handleTagsInputChange('interests', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select name="status" value={formData.status} onChange={handleFormInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Função</label>
                      <select name="role" value={formData.role} onChange={handleFormInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                        <option value="member">Membro</option>
                        <option value="moderator">Moderador</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button type="button" onClick={closeFormModal} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">Cancelar</button>
                    <button type="submit" disabled={saving} className="px-4 py-2 rounded-md border border-transparent text-white bg-red-600 hover:bg-red-700 disabled:opacity-50">
                      {saving ? 'Salvando...' : editingMember ? 'Salvar alterações' : 'Criar membro'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;
