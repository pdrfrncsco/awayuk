import React, { useEffect, useMemo, useState } from 'react';
import onboarding from '../../services/onboardingService';
import { formatApiError } from '../../utils/formatters';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os estados' },
  { value: 'submitted', label: 'Submetida' },
  { value: 'needs_more_info', label: 'Precisa de Informação' },
  { value: 'approved', label: 'Aprovada' },
  { value: 'rejected', label: 'Rejeitada' },
  { value: 'draft', label: 'Rascunho' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'organizer', label: 'Organizador' },
  { value: 'employer', label: 'Empregador' },
];

const OnboardingAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'submitted', application_type: 'all', search: '' });
  const [moderation, setModeration] = useState({ action: '', reason: '' });

  const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId) || null, [applications, selectedAppId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.application_type && filters.application_type !== 'all') params.application_type = filters.application_type;
      if (filters.search) params.search = filters.search;
      const list = await onboarding.getAllApplications(params);
      setApplications(list);
      if (!selectedAppId && list.length > 0) {
        setSelectedAppId(list[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar aplicações (admin):', err);
      setError(formatApiError(err, 'Não foi possível carregar as aplicações.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.application_type]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadApplications();
  };

  const setSelected = (id) => {
    setSelectedAppId(id);
    setModeration({ action: '', reason: '' });
  };

  const runModeration = async (action) => {
    if (!selectedApp) return;
    try {
      setLoading(true);
      const updated = await onboarding.moderateApplication(selectedApp.id, { action, rejection_reason: moderation.reason });
      setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
      setSelectedAppId(updated.id);
      setModeration({ action: '', reason: '' });
    } catch (err) {
      console.error('Erro na moderação:', err);
      setError(formatApiError(err, 'Não foi possível atualizar o estado da aplicação.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Aplicações (Admin)</h1>
          <p className="text-sm text-gray-600">Modere pedidos de onboarding: aprovar, rejeitar ou pedir mais informação.</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              value={filters.application_type}
              onChange={(e) => setFilters(prev => ({ ...prev, application_type: e.target.value }))}
            >
              {TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pesquisa</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Empresa, NIF, email, utilizador"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Pesquisar
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de aplicações */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Aplicações</h2>
          </div>
          <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-auto">
            {loading && applications.length === 0 && (
              <li className="p-4 text-sm text-gray-500">A carregar...</li>
            )}
            {applications.map(app => (
              <li
                key={app.id}
                className={`p-4 cursor-pointer ${selectedAppId === app.id ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelected(app.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{app.companyName}</div>
                    <div className="text-xs text-gray-500">{app.applicationType === 'organizer' ? 'Organizador' : 'Empregador'}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{app.statusLabel}</div>
                </div>
                <div className="mt-1 text-xs text-gray-500">Criada em {new Date(app.createdAt).toLocaleString()}</div>
              </li>
            ))}
            {!loading && applications.length === 0 && (
              <li className="p-4 text-sm text-gray-500">Sem resultados para os filtros selecionados.</li>
            )}
          </ul>
        </div>

        {/* Detalhes e ações */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg">
          {selectedApp ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedApp.companyName}</h3>
                  <p className="text-sm text-gray-600">{selectedApp.applicationType === 'organizer' ? 'Organizador' : 'Empregador'} • Estado: {selectedApp.statusLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">NIF</div>
                  <div className="text-sm text-gray-900">{selectedApp.taxId || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email de contacto</div>
                  <div className="text-sm text-gray-900">{selectedApp.contactEmail || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Telefone</div>
                  <div className="text-sm text-gray-900">{selectedApp.phone || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Site</div>
                  <div className="text-sm text-gray-900">{selectedApp.website || '—'}</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Documentos</h4>
                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {selectedApp.documents.map(doc => (
                      <li key={doc.id} className="py-2 text-sm flex items-center justify-between">
                        <div>
                          <div className="text-gray-900">{doc.docType}</div>
                          {doc.uploadedFile && (
                            <a className="text-red-600 hover:text-red-800 text-xs" href={doc.uploadedFile.url} target="_blank" rel="noreferrer">Abrir ficheiro</a>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleString()}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">Nenhum documento anexado.</div>
                )}
              </div>

              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ações de Moderação</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => runModeration('approve')}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" /> Aprovar
                  </button>
                  <button
                    onClick={() => runModeration('reject')}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircleIcon className="-ml-1 mr-2 h-5 w-5" /> Rejeitar
                  </button>
                  <button
                    onClick={() => runModeration('request_info')}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                  >
                    <InformationCircleIcon className="-ml-1 mr-2 h-5 w-5" /> Pedir Informação
                  </button>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">Nota/Motivo (opcional)</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Indique um motivo de rejeição ou informação em falta"
                    value={moderation.reason}
                    onChange={(e) => setModeration(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm text-gray-500">Selecione uma aplicação para ver detalhes e moderar.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingAdmin;