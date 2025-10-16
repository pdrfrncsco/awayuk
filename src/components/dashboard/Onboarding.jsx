import React, { useEffect, useMemo, useState } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { services } from '../../services';

const Onboarding = () => {
  const onboarding = services.onboarding;
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    application_type: 'organizer',
    company_name: '',
    tax_id: '',
    contact_email: '',
    phone: '',
    address: '',
    website: ''
  });
  const [docForm, setDocForm] = useState({ doc_type: 'other', notes: '', file: null, title: '', description: '' });

  const formatApiError = (err, fallback) => {
    try {
      if (err?.data) {
        if (typeof err.data === 'string') return err.data;
        if (err.data?.detail) return err.data.detail;
        const entries = Object.entries(err.data);
        const fieldMessages = entries
          .filter(([_, v]) => Array.isArray(v) || typeof v === 'string')
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
        if (fieldMessages.length) return fieldMessages.join(' • ');
      }
    } catch (_) {}
    return err?.message || fallback || 'Ocorreu um erro inesperado.';
  };

  const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId) || null, [applications, selectedAppId]);
  const canEdit = useMemo(() => selectedApp && (selectedApp.status === 'draft' || selectedApp.status === 'needs_more_info'), [selectedApp]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await onboarding.getApplications();
      setApplications(list);
      if (!selectedAppId && list.length > 0) {
        setSelectedAppId(list[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar aplicações:', err);
      setError(formatApiError(err, 'Não foi possível carregar as aplicações de onboarding.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const openCreateForm = () => {
    setError(null);
    setForm({
      application_type: 'organizer',
      company_name: '',
      tax_id: '',
      contact_email: '',
      phone: '',
      address: '',
      website: ''
    });
    setShowCreateForm(true);
  };

  const handleCreate = async () => {
    try {
      setCreating(true);
      setError(null);
      // Validação mínima antes de criar
      const name = (form.company_name || '').trim();
      if (!name) {
        setError('O campo "Empresa" é obrigatório.');
        return;
      }
      const validTypes = (onboarding.applicationTypes || []).map(opt => opt.value);
      if (!validTypes.includes(form.application_type)) {
        setError('Selecione um tipo de aplicação válido.');
        return;
      }
      const created = await onboarding.createApplication({
        application_type: form.application_type,
        company_name: name,
        tax_id: form.tax_id,
        contact_email: form.contact_email,
        phone: form.phone,
        address: form.address,
        website: form.website
      });
      setApplications(prev => [created, ...prev]);
      setSelectedAppId(created.id);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Erro ao criar aplicação:', err);
      setError(formatApiError(err, 'Erro ao criar aplicação.'));
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedApp) return;
    try {
      setSaving(true);
      setError(null);
      // Validação mínima antes de guardar
      const name = (form.company_name || '').trim();
      if (!name) {
        setError('O campo "Empresa" é obrigatório para guardar a aplicação.');
        return;
      }
      const updated = await onboarding.updateApplication(selectedApp.id, {
        company_name: name,
        tax_id: form.tax_id,
        contact_email: form.contact_email,
        phone: form.phone,
        address: form.address,
        website: form.website
      });
      setApplications(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    } catch (err) {
      console.error('Erro ao guardar aplicação:', err);
      setError(formatApiError(err, 'Erro ao guardar alterações.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedApp) return;
    try {
      setSubmitting(true);
      setError(null);
      const updated = await onboarding.submitApplication(selectedApp.id);
      setApplications(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    } catch (err) {
      console.error('Erro ao submeter aplicação:', err);
      setError(formatApiError(err, 'Erro ao submeter aplicação.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAttachDocument = async () => {
    if (!selectedApp || !docForm.file) {
      setError('Selecione um ficheiro para anexar.');
      return;
    }
    try {
      setError(null);
      const result = await onboarding.uploadAndAttachDocument(selectedApp.id, docForm.file, {
        title: docForm.title,
        description: docForm.description,
        doc_type: docForm.doc_type,
        notes: docForm.notes
      });
      // Atualizar documentos localmente
      setApplications(prev => prev.map(a => (
        a.id === selectedApp.id
          ? { ...a, documents: [...(a.documents || []), result.document] }
          : a
      )));
      // Limpar formulário de documento
      setDocForm({ doc_type: 'other', notes: '', file: null, title: '', description: '' });
    } catch (err) {
      console.error('Erro ao anexar documento:', err);
      setError(formatApiError(err, 'Erro ao anexar documento.'));
    }
  };

  const handleSelectApp = (id) => {
    setSelectedAppId(id);
    const app = applications.find(a => a.id === id);
    if (app) {
      setForm({
        application_type: app.applicationType || 'organizer',
        company_name: app.companyName || '',
        tax_id: app.taxId || '',
        contact_email: app.contactEmail || '',
        phone: app.phone || '',
        address: app.address || '',
        website: app.website || ''
      });
    }
  };

  const renderStatusBadge = (status) => {
    const map = {
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Rascunho' },
      submitted: { color: 'bg-blue-100 text-blue-800', label: 'Submetida' },
      needs_more_info: { color: 'bg-orange-100 text-orange-800', label: 'Precisa de informação' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Aprovada' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejeitada' }
    };
    const cfg = map[status] || map.draft;
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>;
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-sm text-red-600 hover:text-red-500">Dispensar</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding</h1>
          <p className="mt-2 text-sm text-gray-700">Crie e acompanhe a sua aplicação para se tornar organizador ou empregador.</p>
        </div>
      <div className="mt-4 sm:mt-0 flex space-x-3">
        <button
          type="button"
          onClick={openCreateForm}
          disabled={creating}
          className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nova Aplicação
        </button>
      </div>
    </div>

    {/* Formulário de criação rápida */}
    {showCreateForm && (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Nova Aplicação</h2>
          <p className="text-sm text-gray-600">Preencha os campos mínimos para criar o rascunho.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Aplicação</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                value={form.application_type}
                onChange={(e) => setForm(prev => ({ ...prev, application_type: e.target.value }))}
              >
                {(onboarding.applicationTypes || []).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Empresa</label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => setForm(prev => ({ ...prev, company_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={() => { setShowCreateForm(false); setError(null); }}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )}

      {/* Lista de aplicações */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          {loading ? (
            <div className="text-gray-600">A carregar aplicações...</div>
          ) : applications.length === 0 ? (
            <div className="text-gray-600">Ainda não tem aplicações. Crie uma nova para começar.</div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className={`flex items-center justify-between p-4 border rounded-lg ${selectedAppId === app.id ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.companyName || '(Sem nome)'}</div>
                      <div className="text-xs text-gray-600">Tipo: {app.applicationType} • {renderStatusBadge(app.status)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleSelectApp(app.id)} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50">Abrir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detalhe / Formulário */}
      {selectedApp && (
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Detalhes da Aplicação</h2>
                <p className="mt-1 text-sm text-gray-600">Edite os dados e anexe documentos antes de submeter.</p>
              </div>
              <div className="flex items-center space-x-3">
                {renderStatusBadge(selectedApp.status)}
                {selectedApp.status === 'approved' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Aplicação</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  value={form.application_type}
                  onChange={(e) => setForm(prev => ({ ...prev, application_type: e.target.value }))}
                  disabled={!canEdit}
                >
                  {(onboarding.applicationTypes || []).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Empresa</label>
                <input type="text" value={form.company_name} onChange={(e) => setForm(prev => ({ ...prev, company_name: e.target.value }))}
                  disabled={!canEdit}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">NIF/NIPC</label>
                <input type="text" value={form.tax_id} onChange={(e) => setForm(prev => ({ ...prev, tax_id: e.target.value }))}
                  disabled={!canEdit}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                <input type="email" value={form.contact_email} onChange={(e) => setForm(prev => ({ ...prev, contact_email: e.target.value }))}
                  disabled={!canEdit}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!canEdit}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Morada</label>
                <input type="text" value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!canEdit}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input type="url" value={form.website} onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))}
                  disabled={!canEdit}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canEdit || saving}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedApp.status !== 'draft' || submitting}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                Submeter
              </button>
            </div>

            {/* Documentos */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-900">Documentos</h3>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    {(selectedApp.documents || []).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doc.docType}</div>
                          {doc.uploadedFile?.name && (
                            <div className="text-xs text-gray-600">{doc.uploadedFile.name} • {doc.uploadedFile.humanSize}</div>
                          )}
                        </div>
                        {doc.uploadedFile?.url && (
                          <a href={doc.uploadedFile.url} target="_blank" rel="noopener" className="text-sm text-red-600 hover:text-red-500">Abrir</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        value={docForm.doc_type}
                        onChange={(e) => setDocForm(prev => ({ ...prev, doc_type: e.target.value }))}
                        disabled={!canEdit}
                      >
                        {(onboarding.documentTypes || []).map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notas</label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        rows={3}
                        value={docForm.notes}
                        onChange={(e) => setDocForm(prev => ({ ...prev, notes: e.target.value }))}
                        disabled={!canEdit}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ficheiro</label>
                      <input
                        type="file"
                        className="mt-1 block w-full text-sm"
                        onChange={(e) => setDocForm(prev => ({ ...prev, file: e.target.files[0] }))}
                        disabled={!canEdit}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Título (opcional)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        value={docForm.title}
                        onChange={(e) => setDocForm(prev => ({ ...prev, title: e.target.value }))}
                        disabled={!canEdit}
                      />
                      <input
                        type="text"
                        placeholder="Descrição (opcional)"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        value={docForm.description}
                        onChange={(e) => setDocForm(prev => ({ ...prev, description: e.target.value }))}
                        disabled={!canEdit}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAttachDocument}
                      disabled={!canEdit}
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    >
                      <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                      Anexar Documento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;