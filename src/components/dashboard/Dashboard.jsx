import React from 'react';
import {
  UsersIcon,
  CalendarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total de Membros',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      name: 'Eventos Este Mês',
      value: '24',
      change: '+8%',
      changeType: 'increase',
      icon: CalendarIcon,
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      name: 'Oportunidades Ativas',
      value: '156',
      change: '+23%',
      changeType: 'increase',
      icon: BriefcaseIcon,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    },
    {
      name: 'Posts Publicados',
      value: '89',
      change: '-3%',
      changeType: 'decrease',
      icon: DocumentTextIcon,
      color: 'bg-gradient-to-br from-red-500 to-red-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'member',
      title: 'Novo membro registado',
      description: 'João Silva juntou-se à comunidade',
      time: 'Há 2 horas',
      icon: UsersIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'event',
      title: 'Evento criado',
      description: 'Networking Night em Londres',
      time: 'Há 4 horas',
      icon: CalendarIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'Nova oportunidade',
      description: 'Desenvolvedor Frontend - Tech Company',
      time: 'Há 6 horas',
      icon: BriefcaseIcon,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 4,
      type: 'content',
      title: 'Post publicado',
      description: 'Dicas para entrevistas de emprego no Reino Unido',
      time: 'Há 1 dia',
      icon: DocumentTextIcon,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const quickActions = [
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
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 rounded-xl shadow-xl p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Bem-vindo ao Dashboard AWAYSUK
        </h1>
        <p className="text-sm sm:text-base text-yellow-100">
          Gerencie todos os aspectos da comunidade angolana no Reino Unido
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-xl sm:text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                        )}
                        <span className="ml-1">{stat.change}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Ações Rápidas</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {quickActions.map((action) => (
                <a
                  key={action.name}
                  href={action.href}
                  className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 hover:scale-110`}>
                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base font-medium text-gray-900">{action.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{action.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Atividade Recente</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flow-root">
              <ul className="-mb-6 sm:-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-6 sm:pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-3 sm:left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-2 sm:space-x-3">
                        <div>
                          <span className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center ring-4 sm:ring-8 ring-white ${activity.color} shadow-lg`}>
                            <activity.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5 sm:pt-1.5 flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{activity.description}</p>
                          </div>
                          <div className="text-left sm:text-right text-xs sm:text-sm whitespace-nowrap text-gray-500 mt-1 sm:mt-0">
                            <time>{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Estatísticas Detalhadas</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <EyeIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900">Visualizações</h4>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-blue-600">45.2K</p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Este mês</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900">Interações</h4>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-green-600">12.8K</p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Este mês</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900">Novos Membros</h4>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-yellow-600">342</p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Este mês</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;