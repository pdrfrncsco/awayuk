import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  UsersIcon,
  CalendarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../../services';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayName = user?.full_name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Utilizador';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardStats, activities] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities()
      ]);

      // Transformar dados das estatísticas para o formato do componente
      const transformedStats = [
        {
          name: 'Total de Membros',
          value: dashboardStats.members.total.toLocaleString(),
          change: `+${dashboardStats.members.growthRate}%`,
          changeType: parseFloat(dashboardStats.members.growthRate) >= 0 ? 'increase' : 'decrease',
          icon: UsersIcon,
          color: 'bg-gradient-to-br from-blue-500 to-blue-600',
          details: `${dashboardStats.members.newThisMonth} novos este mês`
        },
        {
          name: 'Eventos Este Mês',
          value: dashboardStats.events.thisMonth.toString(),
          change: `+${dashboardStats.events.growthRate}%`,
          changeType: parseFloat(dashboardStats.events.growthRate) >= 0 ? 'increase' : 'decrease',
          icon: CalendarIcon,
          color: 'bg-gradient-to-br from-green-500 to-green-600',
          details: `${dashboardStats.events.upcoming} próximos eventos`
        },
        {
          name: 'Oportunidades Ativas',
          value: dashboardStats.opportunities.active.toString(),
          change: `+${dashboardStats.opportunities.growthRate}%`,
          changeType: parseFloat(dashboardStats.opportunities.growthRate) >= 0 ? 'increase' : 'decrease',
          icon: BriefcaseIcon,
          color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
          details: `${dashboardStats.opportunities.totalApplications} candidaturas`
        },
        {
          name: 'Visualizações',
          value: dashboardStats.analytics.pageViews.toLocaleString(),
          change: dashboardStats.analytics.bounceRate < 40 ? '+5%' : '-2%',
          changeType: dashboardStats.analytics.bounceRate < 40 ? 'increase' : 'decrease',
          icon: EyeIcon,
          color: 'bg-gradient-to-br from-purple-500 to-purple-600',
          details: `${dashboardStats.analytics.bounceRate}% taxa de rejeição`
        }
      ];

      setStats(transformedStats);
      setRecentActivities(activities);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados do dashboard. Usando dados de exemplo.');
      
      // Usar dados padrão em caso de erro
      setStats(getDefaultStats());
      setRecentActivities(getDefaultActivities());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultStats = () => [
    {
      name: 'Total de Membros',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      details: '342 novos este mês'
    },
    {
      name: 'Eventos Este Mês',
      value: '24',
      change: '+8%',
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      details: '18 próximos eventos'
    },
    {
      name: 'Oportunidades Ativas',
      value: '156',
      change: '+23%',
      changeType: 'increase',
      icon: BriefcaseIcon,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      details: '892 candidaturas'
    },
    {
      name: 'Visualizações',
      value: '45,200',
      change: '+5%',
      changeType: 'increase',
      icon: EyeIcon,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      details: '34.5% taxa de rejeição'
    }
  ];

  const getDefaultActivities = () => [
    {
      id: 1,
      type: 'member',
      title: 'Novo membro registado',
      description: 'João Silva juntou-se à comunidade',
      time: 'Há 2 horas',
      icon: 'UsersIcon',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'event',
      title: 'Evento criado',
      description: 'Networking Night em Londres',
      time: 'Há 4 horas',
      icon: 'CalendarIcon',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'Nova oportunidade',
      description: 'Desenvolvedor Frontend - Tech Company',
      time: 'Há 6 horas',
      icon: 'BriefcaseIcon',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 4,
      type: 'content',
      title: 'Post publicado',
      description: 'Dicas para entrevistas de emprego no Reino Unido',
      time: 'Há 1 dia',
      icon: 'DocumentTextIcon',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const getIconComponent = (iconName) => {
    const icons = {
      UsersIcon,
      CalendarIcon,
      BriefcaseIcon,
      DocumentTextIcon,
      EyeIcon,
      ChatBubbleLeftRightIcon
    };
    return icons[iconName] || DocumentTextIcon;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Bem-vindo(a), {displayName}</h1>
          <p className="text-gray-600">Aqui está a sua visão geral da comunidade AWAYSUK</p>
          
          {error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <div className="flex items-center">
                        {stat.changeType === 'increase' ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      {stat.details && (
                        <p className="text-xs text-gray-500 mt-1">{stat.details}</p>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Acções Rápidas</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    name: 'Criar Evento',
                    description: 'Organizar um novo evento para a comunidade',
                    href: '/dashboard/events/create',
                    icon: CalendarIcon,
                    color: 'bg-green-500 hover:bg-green-600'
                  },
                  {
                    name: 'Adicionar Oportunidade',
                    description: 'Publicar uma nova oportunidade de emprego',
                    href: '/dashboard/opportunities/create',
                    icon: BriefcaseIcon,
                    color: 'bg-yellow-500 hover:bg-yellow-600'
                  },
                  {
                    name: 'Criar Post',
                    description: 'Partilhar conteúdo com a comunidade',
                    href: '/dashboard/content/create',
                    icon: DocumentTextIcon,
                    color: 'bg-purple-500 hover:bg-purple-600'
                  },
                  {
                    name: 'Ver Membros',
                    description: 'Gerir membros da comunidade',
                    href: '/dashboard/members',
                    icon: UsersIcon,
                    color: 'bg-blue-500 hover:bg-blue-600'
                  }
                ].map((action) => (
                  <a
                    key={action.name}
                    href={action.href}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{action.name}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, activityIdx) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivities.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.color}`}>
                                <IconComponent className="h-4 w-4" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                <p className="text-sm text-gray-500">{activity.description}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time>{activity.time}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Estatísticas Detalhadas</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-500 rounded-lg">
                  <EyeIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-gray-900">Visualizações</h4>
                <p className="mt-2 text-3xl font-bold text-blue-600">45.2K</p>
                <p className="mt-1 text-sm text-gray-500">Este mês</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-500 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-gray-900">Interações</h4>
                <p className="mt-2 text-3xl font-bold text-green-600">12.8K</p>
                <p className="mt-1 text-sm text-gray-500">Este mês</p>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-500 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-gray-900">Novos Membros</h4>
                <p className="mt-2 text-3xl font-bold text-yellow-600">342</p>
                <p className="mt-1 text-sm text-gray-500">Este mês</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;