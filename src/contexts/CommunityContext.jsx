import React, { createContext, useContext, useState, useEffect } from 'react';
import membersService from '../services/membersService.js';
import { communityService } from '../services';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [sentConnectionRequests, setSentConnectionRequests] = useState([]);
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

  const transformUserToMember = (u) => ({
    id: u?.id,
    name: u?.full_name || u?.username || `${u?.first_name || ''} ${u?.last_name || ''}`.trim(),
    profession: u?.profession || '',
    location: u?.location || '',
    company: u?.profile?.company || '',
    bio: u?.bio || '',
    profile_image: u?.profile_image || null,
    isOnline: isRecentlyActive(u?.last_login || u?.lastLogin),
  });

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

      // Excluir o utilizador atual
      const currentId = user?.id;
      if (currentId) {
        list = list.filter(m => m.id !== currentId);
      }

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

  const fetchConnections = async () => {
    try {
      const data = await communityService.listConnections();
      const currentId = user?.id;
      const others = (Array.isArray(data) ? data : []).map(conn => {
        const other = conn?.user?.id === currentId ? conn?.connected_user : conn?.user;
        return transformUserToMember(other);
      }).filter(o => !!o?.id);
      setConnections(others);
      // Atualizar status de conexão nos membros
      setMembers(prev => prev.map(m => ({
        ...m,
        connectionStatus: others.some(o => o.id === m.id) ? 'connected' : m.connectionStatus
      })));
    } catch (e) {
      console.warn('Erro ao obter conexões:', e?.message || e);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      const data = await communityService.listConnectionRequests('incoming');
      const incoming = (Array.isArray(data) ? data : []).map(req => ({
        id: req.id,
        fromUser: transformUserToMember(req.from_user),
        message: req.message,
        timestamp: req.created_at,
        status: req.status,
      })).filter(r => !!r.fromUser?.id);
      setConnectionRequests(incoming);
      // Marcar pendentes nos membros para pedidos recebidos
      setMembers(prev => prev.map(m => ({
        ...m,
        connectionStatus: incoming.some(r => r.fromUser.id === m.id) ? 'pending' : m.connectionStatus
      })));
    } catch (e) {
      console.warn('Erro ao obter pedidos de conexão:', e?.message || e);
    }
  };

  const fetchSentConnectionRequests = async () => {
    try {
      const data = await communityService.listConnectionRequests('outgoing');
      const outgoing = (Array.isArray(data) ? data : []).map(req => ({
        id: req.id,
        toUser: transformUserToMember(req.to_user),
        message: req.message,
        timestamp: req.created_at,
        status: req.status,
      })).filter(r => !!r.toUser?.id);
      setSentConnectionRequests(outgoing);
      // Marcar pendentes nos membros para pedidos enviados
      setMembers(prev => prev.map(m => ({
        ...m,
        connectionStatus: outgoing.some(r => r.toUser.id === m.id) ? 'pending' : m.connectionStatus
      })));
    } catch (e) {
      console.warn('Erro ao obter pedidos de conexão enviados:', e?.message || e);
    }
  };

  useEffect(() => {
    fetchMembers(searchFilters);
    fetchConnections();
    fetchConnectionRequests();
    fetchSentConnectionRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const searchMembers = (filters) => {
    setSearchFilters(filters);
    fetchMembers(filters);
  };

  const sendConnectionRequest = async (memberId, message = '') => {
    try {
      // Evitar enviar para si próprio
      if (user?.id && String(user.id) === String(memberId)) {
        setError('Não pode enviar pedido de conexão para si próprio.');
        return;
      }

      // Evitar duplicados se já estiver pendente ou conectado
      const status = getConnectionStatus(memberId);
      if (status === 'connected' || status === 'pending') {
        setError('Já existe uma conexão ou pedido pendente com este membro.');
        return;
      }

      const created = await communityService.sendConnectionRequest(memberId, message);
      // Atualizar estado local
      setMembers(prev => prev.map(member =>
        member.id === memberId
          ? { ...member, connectionStatus: 'pending' }
          : member
      ));
      // Atualizar lista de pedidos enviados imediatamente
      setSentConnectionRequests(prev => {
        const toUser = getMemberById(memberId);
        const normalized = {
          id: created?.id,
          toUser: toUser ? transformUserToMember(toUser) : { id: memberId },
          message: created?.message || message,
          timestamp: created?.created_at,
          status: created?.status || 'pending',
        };
        const exists = prev.some(r => r.id === normalized.id) || prev.some(r => r.toUser?.id === memberId);
        return exists ? prev : [normalized, ...prev];
      });
      // E sincronizar em background com o backend
      fetchSentConnectionRequests();
    } catch (e) {
      console.error('Erro ao enviar pedido de conexão:', e);
      const data = e?.response?.data;
      let msg = e?.message || 'Erro ao enviar pedido';
      if (data) {
        if (typeof data === 'string') {
          msg = data;
        } else if (data.detail) {
          msg = data.detail;
        } else if (data.non_field_errors) {
          msg = Array.isArray(data.non_field_errors) ? data.non_field_errors.join(' ') : String(data.non_field_errors);
        } else if (data.to_user_id) {
          msg = Array.isArray(data.to_user_id) ? data.to_user_id.join(' ') : String(data.to_user_id);
        }
      }
      setError(msg);
    }
  };

  const acceptConnectionRequest = async (requestId) => {
    try {
      await communityService.acceptConnectionRequest(requestId);
      setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
      // Recarregar conexões após aceitar
      await fetchConnections();
    } catch (e) {
      console.error('Erro ao aceitar pedido:', e);
      setError(e?.response?.data?.detail || e?.message || 'Erro ao aceitar pedido');
    }
  };

  const rejectConnectionRequest = async (requestId) => {
    try {
      await communityService.rejectConnectionRequest(requestId);
      setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (e) {
      console.error('Erro ao rejeitar pedido:', e);
      setError(e?.response?.data?.detail || e?.message || 'Erro ao rejeitar pedido');
    }
  };

  const removeConnection = async (memberId) => {
    try {
      await communityService.removeConnection(memberId);
      setConnections(prev => prev.filter(conn => conn.id !== memberId));
      setMembers(prev => prev.map(member =>
        member.id === memberId
          ? { ...member, connectionStatus: 'none' }
          : member
      ));
    } catch (e) {
      console.error('Erro ao remover conexão:', e);
      setError(e?.response?.data?.detail || e?.message || 'Erro ao remover conexão');
    }
  };

  const getMemberById = (id) => members.find(member => member.id === id);

  const getConnectionStatus = (memberId) => {
    if (connections.some(c => c.id === memberId)) return 'connected';
    if (connectionRequests.some(r => r.fromUser?.id === memberId)) return 'pending';
    if (sentConnectionRequests.some(r => r.toUser?.id === memberId)) return 'pending';
    const member = getMemberById(memberId);
    return member ? member.connectionStatus || 'none' : 'none';
  };

  const getMutualConnections = (memberId) => {
    const member = getMemberById(memberId);
    return member ? (member.mutualConnections || 0) : 0;
  };

  const getRecommendedMembers = () => {
    return members
      .filter(member => getConnectionStatus(member.id) === 'none')
      .slice(0, 5);
  };

  const value = {
    // Estado
    members,
    connections,
    connectionRequests,
    sentConnectionRequests,
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