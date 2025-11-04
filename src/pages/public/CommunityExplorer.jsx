import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfileImageUrl } from '../../utils/getProfileImageUrl';
import { services } from '../../services';
import VisitorAction from '../../components/auth/VisitorAction';

const CommunityExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await services.members.getMembers({ limit: 100 });
        setMembers(response?.results || []);
      } catch (err) {
        console.error('Erro ao carregar membros:', err);
        setError('Não foi possível carregar os membros.');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const locations = [...new Set(members.map(member => member.location).filter(Boolean))];
  // Usamos a profissão como "categoria" para fins de filtro
  const categories = [...new Set(members.map(member => member.profession || 'Outros').filter(Boolean))];

  const filteredMembers = members.filter(member => {
    const matchesSearch = (member.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.profession || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.bio || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || member.location === selectedLocation;
    const matchesCategory = !selectedCategory || (member.profession || 'Outros') === selectedCategory;
    
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-gray-300"></i>);
    }

    return stars;
  };

  const MemberCard = ({ member }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={member.cover_image || member.avatar || 'https://picsum.photos/400/200?random=23'} 
          alt="Cover" 
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 right-2">
          {member.isVerified && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <i className="fas fa-check-circle mr-1"></i>
              Verificado
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img 
            src={getProfileImageUrl({ profile_image: member.profile_image, avatar: member.avatar, name: member.name })} 
            alt={member.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200"
          />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.profession}</p>
          </div>
        </div>
        
        {/* Placeholder para rating no futuro */}
        <div className="flex items-center mb-2">
          <div className="flex mr-2">
            {renderStars(5)}
          </div>
          <span className="text-sm text-gray-600">(0)</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{member.bio}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            <i className="fas fa-map-marker-alt mr-1"></i>
            {member.location}
          </span>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {member.profession || 'Membro'}
          </span>
        </div>
        
        {Array.isArray(member.skills) && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {member.skills.slice(0, 2).map((skill, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {member.skills.length > 2 && (
              <span className="text-xs text-gray-500">+{member.skills.length - 2} mais</span>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Link 
            to={`/membro/${member.id}`}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 px-3 rounded text-sm hover:opacity-90 transition-opacity text-center"
          >
            Ver Perfil
          </Link>
          {member.phone && (
            <VisitorAction
              actionType="call"
              showModal={true}
              onAction={() => {
                window.location.href = `tel:${member.phone}`;
              }}
            >
              <a 
                href={`tel:${member.phone}`}
                className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-phone"></i>
              </a>
            </VisitorAction>
          )}
          {member.email && (
            <VisitorAction
              actionType="message"
              showModal={true}
              onAction={() => {
                window.location.href = `mailto:${member.email}`;
              }}
            >
              <a 
                href={`mailto:${member.email}`}
                className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </VisitorAction>
          )}
        </div>
      </div>
    </div>
  );

  const MemberListItem = ({ member }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start space-x-4">
        <img 
          src={getProfileImageUrl({ profile_image: member.profile_image, avatar: member.avatar, name: member.name })} 
          alt={member.name}
          className="w-16 h-16 rounded-full border-2 border-gray-200"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center">
                {member.name}
                {member.verified && (
                  <i className="fas fa-check-circle text-green-500 ml-2"></i>
                )}
              </h3>
              <p className="text-sm text-gray-600">{member.profession}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(5)}
              </div>
              <span className="text-sm text-gray-600">(0)</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mt-2 mb-3">{member.bio}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {member.location}
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {member.category}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Link 
                to={`/membro/${member.id}`}
                className="bg-gradient-to-r from-yellow-500 to-red-500 text-white py-2 px-4 rounded text-sm hover:opacity-90 transition-opacity"
              >
                Ver Perfil
              </Link>
              {member.phone && (
                <VisitorAction
                  actionType="call"
                  showModal={true}
                  onAction={() => {
                    window.location.href = `tel:${member.phone}`;
                  }}
                >
                  <a 
                    href={`tel:${member.phone}`}
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    <i className="fas fa-phone"></i>
                  </a>
                </VisitorAction>
              )}
              {member.email && (
                <VisitorAction
                  actionType="message"
                  showModal={true}
                  onAction={() => {
                    window.location.href = `mailto:${member.email}`;
                  }}
                >
                  <a 
                    href={`mailto:${member.email}`}
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    <i className="fas fa-envelope"></i>
                  </a>
                </VisitorAction>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explorar Comunidade
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra e conecte-se com membros da comunidade angolana em todo o Reino Unido
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesquisar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nome, profissão ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localidade
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todas as localidades</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visualização
              </label>
              <div className="flex rounded-md border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-l-md ${
                    viewMode === 'grid' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-th mr-1"></i>
                  Grade
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-r-md border-l ${
                    viewMode === 'list' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-list mr-1"></i>
                  Lista
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {loading ? (
              <p className="text-sm text-gray-600">A carregar membros...</p>
            ) : (
              <p className="text-sm text-gray-600">
                {filteredMembers.length} membro{filteredMembers.length !== 1 ? 's' : ''} encontrado{filteredMembers.length !== 1 ? 's' : ''}
              </p>
            )}
            
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedLocation('');
                setSelectedCategory('');
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
            <p className="text-gray-600">Tente novamente mais tarde.</p>
          </div>
        )}

        {!error && filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum membro encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termos de pesquisa
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredMembers.map(member => 
              viewMode === 'grid' 
                ? <MemberCard key={member.id} member={member} />
                : <MemberListItem key={member.id} member={member} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityExplorer;
