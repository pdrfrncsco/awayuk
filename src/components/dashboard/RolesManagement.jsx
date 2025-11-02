import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { services } from '../../services';

const RolesManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: 'member',
    display_name: '',
    description: '',
    is_active: true
  });
  const [assignForm, setAssignForm] = useState({
    userId: '',
    roleId: '',
    expiresAt: ''
  });
  const [users, setUsers] = useState([]);

  // Estados para dados da API
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recarregar dados quando a aba ativa ou termo de pesquisa mudam
  useEffect(() => {
    if (activeTab === 'roles') {
      loadRoles();
    } else {
      loadUserRoles();
    }
  }, [activeTab, searchTerm, pagination.page, pagination.limit]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadRoles(),
        loadUserRoles(),
        loadPermissions()
      ]);
    } catch (err) {
      setError('Erro ao carregar dados iniciais');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      };
      const response = await services.accounts.getRoles(params);
      setRoles(response.roles);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: Math.ceil(response.total / prev.limit)
      }));
    } catch (err) {
      console.error('Erro ao carregar roles:', err);
      setError('Erro ao carregar roles');
    }
  };

  const loadUserRoles = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      };
      const response = await services.accounts.getUserRoles(params);
      setUserRoles(response.userRoles);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: Math.ceil(response.total / prev.limit)
      }));
    } catch (err) {
      console.error('Erro ao carregar atribuições de roles:', err);
      setError('Erro ao carregar atribuições de roles');
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await services.accounts.getPermissions();
      setPermissions(response);
    } catch (err) {
      console.error('Erro ao carregar permissões:', err);
    }
  };

  // Handlers para ações
  const handleCreateRole = async (roleData) => {
    try {
      await services.accounts.createRole(roleData);
      await loadRoles();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Erro ao criar role:', err);
      setError('Erro ao criar role');
    }
  };

  const handleUpdateRole = async (roleId, roleData) => {
    try {
      await services.accounts.updateRole(roleId, roleData);
      await loadRoles();
    } catch (err) {
      console.error('Erro ao atualizar role:', err);
      setError('Erro ao atualizar role');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Tem certeza que deseja eliminar esta role?')) {
      try {
        await services.accounts.deleteRole(roleId);
        await loadRoles();
      } catch (err) {
        console.error('Erro ao eliminar role:', err);
        setError('Erro ao eliminar role');
      }
    }
  };

  const handleAssignRole = async (userId, roleId, options = {}) => {
    try {
      await services.accounts.assignRole(userId, roleId, options);
      await loadUserRoles();
      setShowAssignModal(false);
    } catch (err) {
      console.error('Erro ao atribuir role:', err);
      setError('Erro ao atribuir role');
    }
  };

  const handleRevokeRole = async (userRole) => {
    if (window.confirm('Tem certeza que deseja revogar esta role?')) {
      try {
        await services.accounts.revokeRoleByUserAndRole(userRole.user.id, userRole.role.id);
        await loadUserRoles();
      } catch (err) {
        console.error('Erro ao revogar role:', err);
        setError('Erro ao revogar role');
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const filteredRoles = roles.filter(role =>
    role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserRoles = userRoles.filter(userRole =>
    userRole.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userRole.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userRole.role.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (roleName) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-blue-100 text-blue-800',
      premium_member: 'bg-yellow-100 text-yellow-800',
      member: 'bg-green-100 text-green-800'
    };
    return colors[roleName] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isExpiringSoon = (expiresAt) => {
    if (!expiresAt) return false;
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Roles e Permissões</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerir roles de utilizadores e permissões do sistema
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Criar Role
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Atribuir Role
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShieldCheckIcon className="h-5 w-5 inline mr-2" />
              Roles ({roles.length})
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className="h-5 w-5 inline mr-2" />
              Atribuições ({userRoles.length})
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={activeTab === 'roles' ? 'Pesquisar roles...' : 'Pesquisar atribuições...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'roles' ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredRoles.map((role) => (
                <div key={role.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}>
                          {role.displayName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {role.userCount} utilizadores
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{role.description}</p>
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Permissões:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <span key={permission} className="inline-flex items-center px-2 py-1 rounded text-xs bg-white text-gray-600 border">
                              {permissions.find(p => p.id === permission)?.name || permission}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-white text-gray-500 border">
                              +{role.permissions.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRole(role)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Ver detalhes"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Eliminar"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUserRoles.map((userRole) => (
                <div key={userRole.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{userRole.user.name}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userRole.role.name)}`}>
                            {userRole.role.displayName}
                          </span>
                          {isExpired(userRole.expiresAt) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              Expirado
                            </span>
                          )}
                          {isExpiringSoon(userRole.expiresAt) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                              Expira em breve
                            </span>
                          )}
                          {userRole.isActive && !isExpired(userRole.expiresAt) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Ativo
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{userRole.user.email}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>Atribuído por: {userRole.grantedBy.name}</span>
                          <span>•</span>
                          <span>Em: {formatDate(userRole.grantedAt)}</span>
                          {userRole.expiresAt && (
                            <>
                              <span>•</span>
                              <span>Expira: {formatDate(userRole.expiresAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Revogar"
                        onClick={() => handleRevokeRole(userRole)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Criar Role */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Criar Role</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome (interno)</label>
                <select
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                >
                  {[
                    'member',
                    'premium_member',
                    'business_basic',
                    'business_premium',
                    'community_moderator',
                    'event_organizer',
                    'content_creator',
                    'admin',
                    'super_admin'
                  ].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome de exibição</label>
                <input
                  type="text"
                  value={createForm.display_name}
                  onChange={(e) => setCreateForm({ ...createForm, display_name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="create_is_active"
                  type="checkbox"
                  checked={createForm.is_active}
                  onChange={(e) => setCreateForm({ ...createForm, is_active: e.target.checked })}
                  className="h-4 w-4 text-yellow-600 border-gray-300 rounded"
                />
                <label htmlFor="create_is_active" className="ml-2 block text-sm text-gray-700">Ativo</label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-md border bg-white text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleCreateRole(createForm)}
                className="px-4 py-2 rounded-md bg-yellow-600 text-white"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Atribuir Role */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Atribuir Role a Utilizador</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Utilizador</label>
                <input
                  type="number"
                  placeholder="ID do utilizador"
                  value={assignForm.userId}
                  onChange={(e) => setAssignForm({ ...assignForm, userId: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={assignForm.roleId}
                  onChange={(e) => setAssignForm({ ...assignForm, roleId: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                >
                  <option value="">Selecione uma role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.displayName || r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expira em (opcional)</label>
                <input
                  type="datetime-local"
                  value={assignForm.expiresAt}
                  onChange={(e) => setAssignForm({ ...assignForm, expiresAt: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded-md border bg-white text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAssignRole(Number(assignForm.userId), Number(assignForm.roleId), { expiresAt: assignForm.expiresAt || undefined })}
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
                disabled={!assignForm.userId || !assignForm.roleId}
              >
                Atribuir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagement;