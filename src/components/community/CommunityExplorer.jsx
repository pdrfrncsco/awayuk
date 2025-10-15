import React, { useState, useEffect } from 'react';
import { useCommunity } from '../../contexts/CommunityContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon,
  CheckIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';

const CommunityExplorer = () => {
  const {
    members,
    loading,
    searchMembers,
    sendConnectionRequest,
    getConnectionStatus,
    getMutualConnections
  } = useCommunity();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    skills: [],
    interests: [],
    profession: ''
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState('');

  useEffect(() => {
    searchMembers({ searchTerm, ...filters });
  }, [searchTerm, filters]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInterestToggle = (interest) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSendConnectionRequest = (memberId) => {
    sendConnectionRequest(memberId, connectionMessage);
    setSelectedMember(null);
    setConnectionMessage('');
  };

  const getConnectionButton = (member) => {
    const status = getConnectionStatus(member.id);
    
    switch (status) {
      case 'connected':
        return (
          <button
            disabled
            className="inline-flex items-center px-3 py-2 border border-green-300 text-sm leading-4 font-medium rounded-md text-green-700 bg-green-50 cursor-not-allowed"
          >
            <CheckIconSolid className="h-4 w-4 mr-2" />
            Conectado
          </button>
        );
      case 'pending':
        return (
          <button
            disabled
            className="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-50 cursor-not-allowed"
          >
            <ClockIcon className="h-4 w-4 mr-2" />
            Pendente
          </button>
        );
      default:
        return (
          <button
            onClick={() => setSelectedMember(member)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Conectar
          </button>
        );
    }
  };

  const allSkills = [...new Set(members.flatMap(m => m.skills))];
  const allInterests = [...new Set(members.flatMap(m => m.interests))];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Explorar Comunidade
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Descobre e conecta-te com outros membros da comunidade AWAYSUK
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, profissão ou empresa..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
              showFilters 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-md' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                <input
                  type="text"
                  placeholder="Ex: Lisboa, Porto..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profissão</label>
                <input
                  type="text"
                  placeholder="Ex: Engenheiro, Designer..."
                  value={filters.profession}
                  onChange={(e) => handleFilterChange('profession', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Competências</label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filters.skills.includes(skill)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interesses</label>
              <div className="flex flex-wrap gap-2">
                {allInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filters.interests.includes(interest)
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 animate-pulse">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {members.map(member => (
            <div key={member.id} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={member.profile_image || member.avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name || '') + '&background=f59e0b&color=fff')}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {member.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{member.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{member.profession}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {member.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BriefcaseIcon className="h-4 w-4 mr-2" />
                  {member.company}
                </div>
                {getMutualConnections(member.id) > 0 && (
                  <div className="flex items-center text-sm text-blue-600">
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    {getMutualConnections(member.id)} conexões mútuas
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {member.skills.slice(0, 3).map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <div className="flex-1 sm:mr-3">
                  {getConnectionButton(member)}
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors duration-200 self-end sm:self-auto">
                  <HeartIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connection Request Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Conectar com {selectedMember.name}
                </h3>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={selectedMember.profile_image || selectedMember.avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedMember.name || '') + '&background=f59e0b&color=fff')}
                  alt={selectedMember.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedMember.name}</p>
                  <p className="text-sm text-gray-500">{selectedMember.profession}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem (opcional)
                </label>
                <textarea
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                  placeholder="Escreve uma mensagem personalizada..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleSendConnectionRequest(selectedMember.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Enviar Pedido
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && members.length === 0 && (
        <div className="text-center py-12">
          <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum membro encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tenta ajustar os teus filtros de pesquisa.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityExplorer;
