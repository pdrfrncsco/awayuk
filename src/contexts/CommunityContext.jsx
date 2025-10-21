import React, { createContext, useContext, useState, useEffect } from 'react';
import membersService from '../services/membersService.js';

const CommunityContext = createContext();

// Hook personalizado para usar o contexto
const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

// Componente Provider
const CommunityProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    skills: [],
    interests: [],
    profession: '',
    searchTerm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isRecentlyActive = (lastLogin) => {
    try {
      if (!lastLogin) return false;
      const last = new Date(lastLogin).getTime();
      if (!Number.isFinite(last)) return false;
      const THIRTY_MIN_MS = 30 * 60 * 1000;
      return (Date.now() - last) < THIRTY_MIN_MS;
    } catch {
      return false;
    }
  };

  const fetchMembers = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: filters.searchTerm || '',
        location: filters.location || '',
        limit: 50,
        ordering: 'first_name'
      };

      const result = await membersService.getMembers(params);
      let list = result.results || [];

      // Filtros client-side para campos não suportados pelo backend
      if (filters.profession) {
        const q = filters.profession.toLowerCase();
        list = list.filter(m => (m.profession || '').toLowerCase().includes(q));
      }
      if (Array.isArray(filters.skills) && filters.skills.length > 0) {
        list = list.filter(m => (m.skills || []).some(skill =>
          filters.skills.some(filterSkill => (skill || '').toLowerCase().includes(filterSkill.toLowerCase()))
        ));
      }
      if (Array.isArray(filters.interests) && filters.interests.length > 0) {
        list = list.filter(m => (m.interests || []).some(interest => 
          filters.interests.some(filterInterest => (interest || '').toLowerCase().includes(filterInterest.toLowerCase()))
        ));
      }

      // Enriquecer com campos esperados pela UI
      list = list.map(m => ({
        ...m,
        isOnline: isRecentlyActive(m.lastLogin),
        mutualConnections: 0,
        connectionStatus: 'none'
      }));

      setMembers(list);
    } catch (e) {
      setError(e?.message || 'Erro ao obter membros');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(searchFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchMembers = (filters) => {
    setSearchFilters(filters);
    fetchMembers(filters);
  };

  const sendConnectionRequest = (memberId, message = '') => {
    // TODO: Integrar com endpoint real de pedidos de conexão quando disponível
    console.log(`Pedido de conexão enviado para o membro ${memberId}:`, message);
    setMembers(prev => prev.map(member =>
      member.id === memberId
        ? { ...member, connectionStatus: 'pending' }
        : member
    ));
  };

  const acceptConnectionRequest = (requestId) => {
    // TODO: Integrar com endpoint real de aceitar pedido
    const request = connectionRequests.find(req => req.id === requestId);
    if (request) {
      setConnections(prev => [...prev, request.fromUser]);
      setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
    }
  };

  const rejectConnectionRequest = (requestId) => {
    // TODO: Integrar com endpoint real de rejeitar pedido
    setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const removeConnection = (memberId) => {
    // TODO: Integrar com endpoint real de remoção de conexão
    setConnections(prev => prev.filter(conn => conn.id !== memberId));
    setMembers(prev => prev.map(member =>
      member.id === memberId
        ? { ...member, connectionStatus: 'none' }
        : member
    ));
  };

  const getMemberById = (id) => members.find(member => member.id === id);

  const getConnectionStatus = (memberId) => {
    const member = getMemberById(memberId);
    return member ? member.connectionStatus || 'none' : 'none';
  };

  const getMutualConnections = (memberId) => {
    const member = getMemberById(memberId);
    return member ? (member.mutualConnections || 0) : 0;
  };

  const getRecommendedMembers = () => {
    return members
      .filter(member => (member.connectionStatus || 'none') === 'none')
      .slice(0, 5);
  };

  const value = {
    // Estado
    members,
    connections,
    connectionRequests,
    searchFilters,
    loading,
    error,

    // Ações
    searchMembers,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    removeConnection,

    // Utilitários
    getMemberById,
    getConnectionStatus,
    getMutualConnections,
    getRecommendedMembers
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

// Exports
export { CommunityProvider, useCommunity };