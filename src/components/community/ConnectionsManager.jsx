import React, { useState } from 'react';
import { useCommunity } from '../../contexts/CommunityContext';
import {
  UserGroupIcon,
  InboxIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const ConnectionsManager = () => {
  const {
    connections,
    connectionRequests,
    acceptConnectionRequest,
    rejectConnectionRequest,
    removeConnection
  } = useCommunity();

  const [activeTab, setActiveTab] = useState('connections');
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const handleAcceptRequest = (requestId) => {
    acceptConnectionRequest(requestId);
  };

  const handleRejectRequest = (requestId) => {
    rejectConnectionRequest(requestId);
  };

  const handleRemoveConnection = () => {
    if (selectedConnection) {
      removeConnection(selectedConnection.id);
      setSelectedConnection(null);
      setShowRemoveModal(false);
    }
  };

  const tabs = [
    {
      id: 'connections',
      name: 'Minhas Conexões',
      icon: UserGroupIcon,
      count: connections.length
    },
    {
      id: 'requests',
      name: 'Pedidos',
      icon: InboxIcon,
      count: connectionRequests.length
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Conexões
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Gere as tuas conexões e pedidos de conexão
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 sm:py-2 sm:px-1 border-b-2 font-medium text-sm flex items-center justify-center sm:justify-start space-x-2 rounded-lg sm:rounded-none transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50 sm:bg-transparent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 sm:hover:bg-transparent'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
              {tab.count > 0 && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-4">
          {connections.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma conexão ainda</h3>
              <p className="mt-1 text-sm text-gray-500">
                Começa a explorar a comunidade para fazer novas conexões.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {connections.map((connection) => (
                <div key={connection.id} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={connection.avatar}
                          alt={connection.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                        {connection.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">{connection.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{connection.profession}</p>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setSelectedConnection(connection)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <EllipsisVerticalIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {connection.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      {connection.company}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{connection.bio}</p>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="flex-1 inline-flex items-center justify-center px-3 py-2.5 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Mensagem</span>
                      <span className="sm:hidden">Chat</span>
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center px-3 py-2.5 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connection Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {connectionRequests.length === 0 ? (
            <div className="text-center py-12">
              <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pedido pendente</h3>
              <p className="mt-1 text-sm text-gray-500">
                Quando alguém te enviar um pedido de conexão, aparecerá aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {connectionRequests.map((request) => (
                <div key={request.id} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <img
                      src={request.fromUser.avatar}
                      alt={request.fromUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{request.fromUser.name}</h3>
                          <p className="text-sm text-gray-500">{request.fromUser.profession}</p>
                        </div>
                        <span className="text-sm text-gray-500">{formatTime(request.timestamp)}</span>
                      </div>
                      
                      {request.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">{request.message}</p>
                        </div>
                      )}
                      
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Aceitar
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connection Options Modal */}
      {selectedConnection && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Opções de Conexão
                </h3>
                <button
                  onClick={() => setSelectedConnection(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={selectedConnection.avatar}
                  alt={selectedConnection.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedConnection.name}</p>
                  <p className="text-sm text-gray-500">{selectedConnection.profession}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 flex items-center">
                  <ChatBubbleLeftIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-gray-700">Enviar mensagem</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-gray-700">Enviar email</span>
                </button>
                <button
                  onClick={() => setShowRemoveModal(true)}
                  className="w-full text-left px-4 py-3 rounded-md hover:bg-red-50 flex items-center text-red-600"
                >
                  <XMarkIcon className="h-5 w-5 mr-3" />
                  <span>Remover conexão</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Connection Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Remover Conexão
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Tens a certeza que queres remover {selectedConnection?.name} das tuas conexões? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleRemoveConnection}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Remover
                </button>
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsManager;