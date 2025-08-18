import React, { useState } from 'react';
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
  TrashIcon
} from '@heroicons/react/24/outline';

const MembersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - em produção viria de uma API
  const members = [
    {
      id: 1,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+44 7700 900123',
      location: 'Londres',
      joinDate: '2024-01-15',
      status: 'active',
      role: 'member',
      profession: 'Engenheira de Software',
      company: 'Tech Solutions Ltd',
      avatar: null
    },
    {
      id: 2,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '+44 7700 900124',
      location: 'Manchester',
      joinDate: '2024-02-20',
      status: 'active',
      role: 'admin',
      profession: 'Gestor de Projetos',
      company: 'Business Corp',
      avatar: null
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '+44 7700 900125',
      location: 'Birmingham',
      joinDate: '2024-03-10',
      status: 'pending',
      role: 'member',
      profession: 'Designer Gráfica',
      company: 'Creative Agency',
      avatar: null
    },
    {
      id: 4,
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      phone: '+44 7700 900126',
      location: 'Edinburgh',
      joinDate: '2024-01-05',
      status: 'inactive',
      role: 'member',
      profession: 'Consultor Financeiro',
      company: 'Finance Plus',
      avatar: null
    },
    {
      id: 5,
      name: 'Carla Mendes',
      email: 'carla.mendes@email.com',
      phone: '+44 7700 900127',
      location: 'Liverpool',
      joinDate: '2024-02-28',
      status: 'active',
      role: 'moderator',
      profession: 'Professora',
      company: 'University College',
      avatar: null
    }
  ];

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

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
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Membros</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie todos os membros da comunidade AWAYSUK
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
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
              Membros ({filteredMembers.length})
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

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
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
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
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
                      {getStatusBadge(member.status)}
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
                        <button className="text-red-600 hover:text-red-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum membro encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar os filtros ou termos de pesquisa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersManagement;