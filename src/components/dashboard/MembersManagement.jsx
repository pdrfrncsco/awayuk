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
  const [filterUserType, setFilterUserType] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Modal e Formulário de CRUD
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    user_type: 'member',
    password: '',
    password_confirm: ''
  });
  const [creating, setCreating] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Modal e Formulário de Edição
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    user_type: 'member'
  });
  const [editing, setEditing] = useState(false);

  // Modal de Remoção
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // CRUD desativado

  // CRUD desativado

  // CRUD desativado

  // Carregar membros
  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        // Busca será feita client-side no array retornado (endpoint não suporta search)
        page: pagination.page,
        limit: pagination.limit,
        user_type: filterUserType !== 'all' ? filterUserType : undefined
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

  // Pesquisa cliente-side
  const normalized = (val) => (val || '').toString().toLowerCase();
  const filteredMembers = members.filter((m) => {
    if (!searchTerm) return true;
    const q = normalized(searchTerm);
    return (
      normalized(m.name).includes(q) ||
      normalized(m.email).includes(q) ||
      normalized(m.phone).includes(q) ||
      normalized(m.location).includes(q) ||
      normalized(m.company).includes(q) ||
      normalized(m.profession).includes(q)
    );
  });

  // Handlers de criação
  const openCreateModal = () => {
    setCreateForm({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      user_type: 'member',
      password: '',
      password_confirm: ''
    });
    setError(null);
    setSuccessMessage(null);
    setUsernameAvailable(null);
    setEmailAvailable(null);
    setShowCreateModal(true);
  };

  // Handlers de edição
  const openEditModal = (member) => {
    setEditForm({
      id: member.id,
      username: member.username || '',
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      user_type: member.role === 'admin' ? 'admin' : (member.user_type || 'member')
    });
    setError(null);
    setSuccessMessage(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditing(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload = {
        username: editForm.username,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        user_type: editForm.user_type
      };
      const updated = await membersService.updateMember(editForm.id, payload);
      setMembers(prev => prev.map(m => (m.id === updated.id ? updated : m)));
      setSuccessMessage('Membro atualizado com sucesso.');
      closeEditModal();
    } catch (err) {
      console.error('Erro ao atualizar membro:', err);
      setError(err?.message || 'Erro ao atualizar membro.');
    } finally {
      setEditing(false);
    }
  };

  // Handlers de remoção
  const openDeleteModal = (member) => {
    setMemberToDelete(member);
    setError(null);
    setSuccessMessage(null);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleting(false);
    setMemberToDelete(null);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await membersService.deleteMember(memberToDelete.id);
      setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      setSuccessMessage('Membro removido com sucesso.');
      closeDeleteModal();
    } catch (err) {
      console.error('Erro ao remover membro:', err);
      setError(err?.message || 'Erro ao remover membro.');
    } finally {
      setDeleting(false);
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'username') {
      setUsernameAvailable(null);
    }
    if (name === 'email') {
      setEmailAvailable(null);
    }
  };

  // Debounce: verificar disponibilidade de username
  useEffect(() => {
    const val = (createForm.username || '').trim();
    if (!val) {
      setUsernameAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setCheckingUsername(true);
        const available = await membersService.checkUsernameAvailability(val);
        setUsernameAvailable(available);
      } catch (err) {
        console.warn('Falha ao verificar username:', err);
        setUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [createForm.username]);

  // Debounce: verificar disponibilidade de email (validação simples de formato)
  useEffect(() => {
    const val = (createForm.email || '').trim();
    if (!val) {
      setEmailAvailable(null);
      return;
    }
    const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmail.test(val)) {
      setEmailAvailable(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setCheckingEmail(true);
        const available = await membersService.checkEmailAvailability(val);
        setEmailAvailable(available);
      } catch (err) {
        console.warn('Falha ao verificar email:', err);
        setEmailAvailable(false);
      } finally {
        setCheckingEmail(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [createForm.email]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (!createForm.username || !createForm.email || !createForm.password || !createForm.password_confirm) {
        setError('Preencha username, email e passwords.');
        setCreating(false);
        return;
      }
      if (createForm.password !== createForm.password_confirm) {
        setError('As passwords não coincidem.');
        setCreating(false);
        return;
      }
      if (usernameAvailable === false) {
        setError('O username já está em uso.');
        setCreating(false);
        return;
      }
      if (emailAvailable === false) {
        setError('O email já está em uso ou inválido.');
        setCreating(false);
        return;
      }

      const newMember = await membersService.createMember(createForm);
      setSuccessMessage(`Membro criado: ${newMember?.name || createForm.username}`);
      setShowCreateModal(false);
      await loadMembers();
    } catch (err) {
      console.error('Erro ao criar membro:', err);
      // Formatar mensagens de validação do backend (ex.: { password: ["mensagem..."] })
      let formatted = err?.message || 'Erro ao criar membro.';
      if (err?.data && typeof err.data === 'object') {
        const parts = [];
        Object.entries(err.data).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages.join(' ') : String(messages);
          parts.push(`${field}: ${msg}`);
        });
        if (parts.length) formatted = parts.join(' | ');
      }
      setError(formatted);
    } finally {
      setCreating(false);
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
  }, [searchTerm, filterUserType]);

  // Alternar status do membro
  // Alternar status desativado (não suportado pelo backend atual)

  // Deletar membro
  // Deletar membro desativado (não suportado pelo backend atual)

  // Exportar dados
  // Exportação desativada (endpoint não disponível no backend)

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
            onClick={openCreateModal}
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
                  <label className="block text-sm font-medium text-gray-700">Tipo de Utilizador</label>
                  <select
                    value={filterUserType}
                    onChange={(e) => setFilterUserType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Todos</option>
                    <option value="member">Membro</option>
                    <option value="business">Business</option>
                    <option value="admin">Admin</option>
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

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

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
                    {filteredMembers.map((member) => (
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
                          {getRoleBadge(member.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {new Date(member.joinDate).toLocaleDateString('pt-PT')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <button onClick={() => openEditModal(member)} title="Editar" className="hover:text-gray-600">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => openDeleteModal(member)} title="Remover" className="hover:text-gray-600">
                              <TrashIcon className="h-5 w-5" />
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

      {/* Modal de Criação de Membro (via registo) */}
      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreateSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Adicionar Membro</h3>
                      <p className="mt-1 text-sm text-gray-500">Cria um novo membro através do endpoint de registo.</p>
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                          <div className="flex">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                              <p className="text-sm text-red-800">{error}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Username</label>
                          <input name="username" value={createForm.username} onChange={handleCreateChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                          {createForm.username && (
                            <p className={`mt-1 text-xs ${checkingUsername ? 'text-gray-500' : usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {checkingUsername
                                ? 'A verificar disponibilidade...'
                                : usernameAvailable === null
                                  ? ''
                                  : usernameAvailable
                                    ? 'Username disponível'
                                    : 'Username já em uso'}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Primeiro Nome</label>
                            <input name="firstName" value={createForm.firstName} onChange={handleCreateChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Último Nome</label>
                            <input name="lastName" value={createForm.lastName} onChange={handleCreateChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input type="email" name="email" value={createForm.email} onChange={handleCreateChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                          {createForm.email && (
                            <p className={`mt-1 text-xs ${checkingEmail ? 'text-gray-500' : emailAvailable ? 'text-green-600' : 'text-red-600'}`}>
                              {checkingEmail
                                ? 'A verificar disponibilidade...'
                                : emailAvailable === null
                                  ? ''
                                  : emailAvailable
                                    ? 'Email disponível'
                                    : 'Email inválido ou já em uso'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tipo de Utilizador</label>
                          <select name="user_type" value={createForm.user_type} onChange={handleCreateChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option value="member">Membro</option>
                            <option value="business">Business</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <input type="password" name="password" value={createForm.password} onChange={handleCreateChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Confirmar Password</label>
                          <input type="password" name="password_confirm" value={createForm.password_confirm} onChange={handleCreateChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-500">A password deve ter ≥ 8 caracteres, não ser comum nem apenas numérica.</p>
                        <button
                          type="button"
                          onClick={() => {
                            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.<>?';
                            let pwd = '';
                            for (let i = 0; i < 14; i++) {
                              pwd += chars[Math.floor(Math.random() * chars.length)];
                            }
                            setCreateForm(prev => ({ ...prev, password: pwd, password_confirm: pwd }));
                          }}
                          className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          Gerar password forte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" disabled={creating} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white text-base font-medium hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                    {creating ? 'A criar...' : 'Criar'}
                  </button>
                  <button type="button" onClick={closeCreateModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Membro */}
      {showEditModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleEditSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Editar Membro</h3>
                      <p className="mt-1 text-sm text-gray-500">Atualiza os dados básicos do membro.</p>
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                          <div className="flex">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                              <p className="text-sm text-red-800">{error}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Username</label>
                          <input name="username" value={editForm.username} onChange={handleEditChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Primeiro Nome</label>
                            <input name="firstName" value={editForm.firstName} onChange={handleEditChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Último Nome</label>
                            <input name="lastName" value={editForm.lastName} onChange={handleEditChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tipo de Utilizador</label>
                          <select name="user_type" value={editForm.user_type} onChange={handleEditChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option value="member">Membro</option>
                            <option value="business">Business</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" disabled={editing} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white text-base font-medium hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                    {editing ? 'A atualizar...' : 'Guardar'}
                  </button>
                  <button type="button" onClick={closeEditModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Remoção */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Remover Membro</h3>
                    <p className="mt-1 text-sm text-gray-500">Tem a certeza que pretende remover este membro?</p>
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                        <div className="flex">
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                          <div className="ml-3">
                            <p className="text-sm text-red-800">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={confirmDelete} disabled={deleting} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white text-base font-medium hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                  {deleting ? 'A remover...' : 'Remover'}
                </button>
                <button onClick={closeDeleteModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;
