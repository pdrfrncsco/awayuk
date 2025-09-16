import React, { createContext, useContext, useState, useEffect } from 'react';

const CommunityContext = createContext();

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

export const CommunityProvider = ({ children }) => {
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

  // Mock data para demonstração
  const mockMembers = [
    {
      id: 1,
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      location: 'Lisboa, Portugal',
      profession: 'Engenheira de Software',
      company: 'Tech Solutions',
      bio: 'Apaixonada por tecnologia e inovação. Especialista em React e Node.js.',
      skills: ['React', 'Node.js', 'JavaScript', 'Python'],
      interests: ['Tecnologia', 'Empreendedorismo', 'Viagens'],
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      joinedDate: '2023-01-15',
      isOnline: true,
      mutualConnections: 5,
      connectionStatus: 'none' // none, pending, connected, blocked
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao.santos@email.com',
      location: 'Porto, Portugal',
      profession: 'Designer UX/UI',
      company: 'Creative Agency',
      bio: 'Designer com foco em experiência do utilizador e interfaces intuitivas.',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      interests: ['Design', 'Arte', 'Fotografia'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      joinedDate: '2023-02-20',
      isOnline: false,
      mutualConnections: 3,
      connectionStatus: 'connected'
    },
    {
      id: 3,
      name: 'Maria Costa',
      email: 'maria.costa@email.com',
      location: 'Coimbra, Portugal',
      profession: 'Gestora de Projetos',
      company: 'Innovation Hub',
      bio: 'Especialista em gestão de projetos ágeis e transformação digital.',
      skills: ['Scrum', 'Agile', 'Project Management', 'Leadership'],
      interests: ['Gestão', 'Liderança', 'Inovação'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      joinedDate: '2023-03-10',
      isOnline: true,
      mutualConnections: 8,
      connectionStatus: 'pending'
    },
    {
      id: 4,
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      location: 'Braga, Portugal',
      profession: 'Analista de Dados',
      company: 'Data Insights',
      bio: 'Transformo dados em insights valiosos para negócios.',
      skills: ['Python', 'SQL', 'Machine Learning', 'Tableau'],
      interests: ['Data Science', 'IA', 'Estatística'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      joinedDate: '2023-04-05',
      isOnline: false,
      mutualConnections: 2,
      connectionStatus: 'none'
    },
    {
      id: 5,
      name: 'Sofia Ferreira',
      email: 'sofia.ferreira@email.com',
      location: 'Aveiro, Portugal',
      profession: 'Marketing Digital',
      company: 'Digital Growth',
      bio: 'Especialista em estratégias de marketing digital e growth hacking.',
      skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
      interests: ['Marketing', 'Empreendedorismo', 'Redes Sociais'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      joinedDate: '2023-05-12',
      isOnline: true,
      mutualConnections: 6,
      connectionStatus: 'none'
    }
  ];

  const mockConnectionRequests = [
    {
      id: 1,
      fromUser: {
        id: 6,
        name: 'Carlos Mendes',
        profession: 'Desenvolvedor Frontend',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      message: 'Olá! Gostaria de conectar contigo para trocar experiências sobre React.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      status: 'pending'
    },
    {
      id: 2,
      fromUser: {
        id: 7,
        name: 'Luisa Rodrigues',
        profession: 'Product Manager',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150'
      },
      message: 'Vi o teu perfil e achei interessante a tua experiência. Vamos conectar?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true);
    setTimeout(() => {
      setMembers(mockMembers);
      setConnectionRequests(mockConnectionRequests);
      setConnections(mockMembers.filter(m => m.connectionStatus === 'connected'));
      setLoading(false);
    }, 1000);
  }, []);

  const searchMembers = (filters) => {
    setSearchFilters(filters);
    setLoading(true);
    
    // Simular busca
    setTimeout(() => {
      let filtered = mockMembers;
      
      if (filters.searchTerm) {
        filtered = filtered.filter(member => 
          member.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          member.profession.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          member.company.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
      
      if (filters.location) {
        filtered = filtered.filter(member => 
          member.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      if (filters.profession) {
        filtered = filtered.filter(member => 
          member.profession.toLowerCase().includes(filters.profession.toLowerCase())
        );
      }
      
      if (filters.skills.length > 0) {
        filtered = filtered.filter(member => 
          member.skills.some(skill => 
            filters.skills.some(filterSkill => 
              skill.toLowerCase().includes(filterSkill.toLowerCase())
            )
          )
        );
      }
      
      if (filters.interests.length > 0) {
        filtered = filtered.filter(member => 
          member.interests.some(interest => 
            filters.interests.some(filterInterest => 
              interest.toLowerCase().includes(filterInterest.toLowerCase())
            )
          )
        );
      }
      
      setMembers(filtered);
      setLoading(false);
    }, 500);
  };

  const sendConnectionRequest = (memberId, message = '') => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, connectionStatus: 'pending' }
        : member
    ));
    
    // Simular envio de pedido
    console.log(`Pedido de conexão enviado para o membro ${memberId}:`, message);
  };

  const acceptConnectionRequest = (requestId) => {
    const request = connectionRequests.find(req => req.id === requestId);
    if (request) {
      setConnections(prev => [...prev, request.fromUser]);
      setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
    }
  };

  const rejectConnectionRequest = (requestId) => {
    setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const removeConnection = (memberId) => {
    setConnections(prev => prev.filter(conn => conn.id !== memberId));
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, connectionStatus: 'none' }
        : member
    ));
  };

  const getMemberById = (id) => {
    return members.find(member => member.id === id);
  };

  const getConnectionStatus = (memberId) => {
    const member = getMemberById(memberId);
    return member ? member.connectionStatus : 'none';
  };

  const getMutualConnections = (memberId) => {
    const member = getMemberById(memberId);
    return member ? member.mutualConnections : 0;
  };

  const getRecommendedMembers = () => {
    // Simular algoritmo de recomendação baseado em conexões mútuas e interesses
    return mockMembers
      .filter(member => member.connectionStatus === 'none')
      .sort((a, b) => b.mutualConnections - a.mutualConnections)
      .slice(0, 5);
  };

  const value = {
    // Estado
    members,
    connections,
    connectionRequests,
    searchFilters,
    loading,
    
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