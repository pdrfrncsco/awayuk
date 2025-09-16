import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import opportunityService from '../../services/opportunityService';

const OpportunityDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    resume_url: '',
    portfolio_url: '',
    additional_info: ''
  });

  useEffect(() => {
    if (slug) {
      loadOpportunity();
    }
  }, [slug]);

  const loadOpportunity = async () => {
    try {
      setLoading(true);
      const response = await opportunityService.getOpportunity(slug);
      setOpportunity(response);
      
      if (isAuthenticated) {
        // Verificar se já candidatou ou marcou como favorito
        setHasApplied(response.user_has_applied || false);
        setIsBookmarked(response.user_has_bookmarked || false);
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar oportunidade');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      await opportunityService.applyToOpportunity(opportunity.id, applicationData);
      setHasApplied(true);
      setShowApplicationForm(false);
      alert('Candidatura enviada com sucesso!');
    } catch (err) {
      alert(err.message || 'Erro ao enviar candidatura');
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setBookmarking(true);
      if (isBookmarked) {
        await opportunityService.removeBookmark(opportunity.id);
        setIsBookmarked(false);
      } else {
        await opportunityService.addBookmark(opportunity.id);
        setIsBookmarked(true);
      }
    } catch (err) {
      alert(err.message || 'Erro ao atualizar favoritos');
    } finally {
      setBookmarking(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      job: 'fas fa-briefcase',
      internship: 'fas fa-graduation-cap',
      freelance: 'fas fa-laptop',
      partnership: 'fas fa-handshake',
      investment: 'fas fa-chart-line',
      collaboration: 'fas fa-users',
      mentorship: 'fas fa-user-tie',
      volunteer: 'fas fa-heart'
    };
    return icons[type] || 'fas fa-briefcase';
  };

  const getTypeLabel = (type) => {
    const labels = {
      job: 'Emprego',
      internship: 'Estágio',
      freelance: 'Freelance',
      partnership: 'Parceria',
      investment: 'Investimento',
      collaboration: 'Colaboração',
      mentorship: 'Mentoria',
      volunteer: 'Voluntariado'
    };
    return labels[type] || type;
  };

  const getExperienceLabel = (level) => {
    const labels = {
      entry: 'Iniciante',
      junior: 'Júnior',
      mid: 'Intermédio',
      senior: 'Sénior',
      executive: 'Executivo'
    };
    return labels[level] || level;
  };

  const getWorkTypeLabel = (type) => {
    const labels = {
      remote: 'Remoto',
      onsite: 'Presencial',
      hybrid: 'Híbrido'
    };
    return labels[type] || type;
  };

  const formatSalary = (min, max, currency = 'EUR') => {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
    if (min && max) {
      return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    } else if (min) {
      return `A partir de ${symbol}${min.toLocaleString()}`;
    } else if (max) {
      return `Até ${symbol}${max.toLocaleString()}`;
    }
    return 'Salário a negociar';
  };

  const isExpired = () => {
    if (!opportunity?.deadline) return false;
    return new Date(opportunity.deadline) < new Date();
  };

  const getDaysUntilDeadline = () => {
    if (!opportunity?.deadline) return null;
    const deadline = new Date(opportunity.deadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oportunidade não encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'A oportunidade que procura não existe ou foi removida.'}
          </p>
          <Link
            to="/oportunidades"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md hover:opacity-90 transition duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar às oportunidades
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilDeadline = getDaysUntilDeadline();
  const expired = isExpired();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-700 hover:text-red-600">
                Início
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
                <Link to="/oportunidades" className="text-gray-700 hover:text-red-600">
                  Oportunidades
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
                <span className="text-gray-500 truncate">{opportunity.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {opportunity.company_logo ? (
                      <img
                        src={opportunity.company_logo}
                        alt={opportunity.company_name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                        <i className={`${getTypeIcon(opportunity.type)} text-white text-xl`}></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {opportunity.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                      {opportunity.company_name}
                    </p>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                      <span>
                        {opportunity.location_city}, {opportunity.location_country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-col items-end space-y-2">
                  {opportunity.is_featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Destaque
                    </span>
                  )}
                  {expired && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      Expirada
                    </span>
                  )}
                </div>
              </div>

              {/* Badges de informação */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {getTypeLabel(opportunity.type)}
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {getWorkTypeLabel(opportunity.work_type)}
                </span>
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                  {getExperienceLabel(opportunity.experience_level)}
                </span>
                {opportunity.category && (
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                    {opportunity.category.name}
                  </span>
                )}
              </div>

              {/* Salário */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <i className="fas fa-euro-sign text-red-500 mr-3"></i>
                  <div>
                    <p className="text-sm text-gray-600">Remuneração</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatSalary(opportunity.salary_min, opportunity.salary_max, opportunity.salary_currency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Descrição
                </h2>
                <div className="prose max-w-none text-gray-700">
                  {opportunity.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Requisitos */}
              {opportunity.requirements && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Requisitos
                  </h2>
                  <div className="prose max-w-none text-gray-700">
                    {opportunity.requirements.split('\n').map((requirement, index) => (
                      <p key={index} className="mb-2">
                        {requirement}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefícios */}
              {opportunity.benefits && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Benefícios
                  </h2>
                  <div className="prose max-w-none text-gray-700">
                    {opportunity.benefits.split('\n').map((benefit, index) => (
                      <p key={index} className="mb-2">
                        {benefit}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações de contacto */}
              {opportunity.contact_email && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Contacto
                  </h3>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-blue-500 mr-2"></i>
                    <a
                      href={`mailto:${opportunity.contact_email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {opportunity.contact_email}
                    </a>
                  </div>
                  {opportunity.contact_phone && (
                    <div className="flex items-center mt-2">
                      <i className="fas fa-phone text-blue-500 mr-2"></i>
                      <a
                        href={`tel:${opportunity.contact_phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {opportunity.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              {/* Deadline */}
              {opportunity.deadline && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Prazo de candidatura
                  </h3>
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-red-500 mr-2"></i>
                    <div>
                      <p className="text-gray-900">
                        {new Date(opportunity.deadline).toLocaleDateString('pt-PT')}
                      </p>
                      {!expired && daysUntilDeadline !== null && (
                        <p className={`text-sm ${daysUntilDeadline <= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                          {daysUntilDeadline > 0 
                            ? `${daysUntilDeadline} dia${daysUntilDeadline !== 1 ? 's' : ''} restante${daysUntilDeadline !== 1 ? 's' : ''}`
                            : 'Último dia'
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="space-y-3">
                {!expired && (
                  <>
                    {hasApplied ? (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center">
                          <i className="fas fa-check-circle text-green-500 mr-2"></i>
                          <span className="text-green-800 font-medium">
                            Candidatura enviada
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowApplicationForm(true)}
                        className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white py-3 px-4 rounded-md hover:opacity-90 transition duration-300 font-medium"
                      >
                        <i className="fas fa-paper-plane mr-2"></i>
                        Candidatar-me
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className={`w-full py-3 px-4 rounded-md border transition duration-300 font-medium ${
                    isBookmarked
                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${isBookmarked ? 'fas' : 'far'} fa-heart mr-2`}></i>
                  {isBookmarked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: opportunity.title,
                        text: opportunity.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copiado para a área de transferência!');
                    }
                  }}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition duration-300 font-medium"
                >
                  <i className="fas fa-share-alt mr-2"></i>
                  Partilhar
                </button>
              </div>

              {/* Informações adicionais */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Informações
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publicado em:</span>
                    <span className="text-gray-900">
                      {new Date(opportunity.created_at).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visualizações:</span>
                    <span className="text-gray-900">
                      {opportunity.views_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Candidaturas:</span>
                    <span className="text-gray-900">
                      {opportunity.applications_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Oportunidades relacionadas */}
            {opportunity.related_opportunities && opportunity.related_opportunities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Oportunidades relacionadas
                </h3>
                <div className="space-y-3">
                  {opportunity.related_opportunities.slice(0, 3).map(related => (
                    <Link
                      key={related.id}
                      to={`/oportunidades/${related.slug}`}
                      className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-300"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {related.company_name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de candidatura */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Candidatar-me a: {opportunity.title}
                  </h2>
                  <button
                    onClick={() => setShowApplicationForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <form onSubmit={handleApply} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carta de apresentação *
                    </label>
                    <textarea
                      value={applicationData.cover_letter}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        cover_letter: e.target.value
                      })}
                      rows={6}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Explique porque é o candidato ideal para esta oportunidade..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do CV
                    </label>
                    <input
                      type="url"
                      value={applicationData.resume_url}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        resume_url: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do portfólio
                    </label>
                    <input
                      type="url"
                      value={applicationData.portfolio_url}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        portfolio_url: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informações adicionais
                    </label>
                    <textarea
                      value={applicationData.additional_info}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        additional_info: e.target.value
                      })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Qualquer informação adicional que considere relevante..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-md hover:opacity-90 transition duration-300 disabled:opacity-50"
                    >
                      {applying ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Enviar candidatura
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetail;