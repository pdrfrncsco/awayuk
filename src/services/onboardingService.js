import apiClient from './api.js';

/**
 * Serviço para gerir o fluxo de Onboarding (aplicações e documentos)
 * Endpoints (API base inclui '/api'):
 * - Listar/Criar aplicações: GET/POST `/accounts/onboarding/applications/`
 * - Detalhe/Atualizar aplicação: GET/PATCH `/accounts/onboarding/applications/:id/`
 * - Submeter aplicação: POST `/accounts/onboarding/applications/:id/submit/`
 * - Adicionar documento: POST `/accounts/onboarding/applications/:id/documents/`
 * - Upload de ficheiro: POST `/uploads/files/upload/`
 */
class OnboardingService {
  // Tipos e estados conhecidos (usados no UI)
  applicationTypes = [
    { value: 'organizer', label: 'Organizador' },
    { value: 'employer', label: 'Empregador' }
  ];

  documentTypes = [
    { value: 'company_registration', label: 'Registo de Empresa' },
    { value: 'tax_certificate', label: 'Certificado Fiscal' },
    { value: 'id', label: 'Documento de Identidade' },
    { value: 'address_proof', label: 'Comprovativo de Morada' },
    { value: 'business_license', label: 'Licença de Atividade' },
    { value: 'other', label: 'Outro' }
  ];

  statusLabels = {
    draft: 'Rascunho',
    submitted: 'Submetida',
    needs_more_info: 'Precisa de Informação',
    approved: 'Aprovada',
    rejected: 'Rejeitada'
  };

  // Listar aplicações do utilizador
  async getApplications(params = {}) {
    const data = await apiClient.get('/accounts/onboarding/applications/', { params });
    // DRF List API retorna {results, count} se paginado; aqui retornamos array direto se aplicável
    return Array.isArray(data) ? data.map(this.transformApplication) : (data.results || []).map(this.transformApplication);
  }

  // Criar nova aplicação de onboarding
  async createApplication(payload) {
    const data = await apiClient.post('/accounts/onboarding/applications/', payload);
    return this.transformApplication(data);
  }

  // Obter detalhe de aplicação
  async getApplication(id) {
    const data = await apiClient.get(`/accounts/onboarding/applications/${id}/`);
    return this.transformApplication(data);
  }

  // Atualizar aplicação (permitido quando status = draft ou needs_more_info)
  async updateApplication(id, partial) {
    const data = await apiClient.patch(`/accounts/onboarding/applications/${id}/`, partial);
    return this.transformApplication(data);
  }

  // Submeter aplicação para revisão
  async submitApplication(id) {
    const data = await apiClient.post(`/accounts/onboarding/applications/${id}/submit/`);
    return this.transformApplication(data);
  }

  // Anexar documento já carregado
  async addDocument(applicationId, { uploaded_file_id, doc_type = 'other', notes = '' }) {
    const data = await apiClient.post(`/accounts/onboarding/applications/${applicationId}/documents/`, {
      uploaded_file_id,
      doc_type,
      notes
    });
    return this.transformDocument(data);
  }

  // Carregar ficheiro e anexar à aplicação num único fluxo
  async uploadAndAttachDocument(applicationId, file, { title = '', description = '', doc_type = 'other', notes = '' } = {}) {
    // 1) Upload do ficheiro
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', title);
    if (description) form.append('description', description);
    // is_public default true no backend; não precisamos enviar a menos que desejado

    const uploaded = await apiClient.upload('/uploads/files/upload/', form);
    const uploadedFileId = uploaded.id || uploaded.data?.id; // compat para diferentes formatos

    // 2) Anexar documento à aplicação
    const doc = await this.addDocument(applicationId, { uploaded_file_id: uploadedFileId, doc_type, notes });
    return { uploaded, document: doc };
  }

  // Utilitários de transformação para UI
  transformApplication = (app) => {
    if (!app) return null;
    return {
      id: app.id,
      applicationType: app.application_type,
      companyName: app.company_name,
      taxId: app.tax_id,
      contactEmail: app.contact_email,
      phone: app.phone,
      address: app.address,
      website: app.website,
      data: app.data || {},
      status: app.status,
      statusLabel: this.statusLabels[app.status] || app.status,
      rejectionReason: app.rejection_reason,
      verifiedAt: app.verified_at,
      approvedBy: app.approved_by,
      approvedByName: app.approved_by_name,
      createdAt: app.created_at,
      updatedAt: app.updated_at,
      documents: (app.documents || []).map(this.transformDocument)
    };
  };

  transformDocument = (doc) => {
    if (!doc) return null;
    const uploaded = doc.uploaded_file || doc.uploadedFile;
    return {
      id: doc.id,
      docType: doc.doc_type,
      notes: doc.notes,
      uploadedFile: uploaded ? {
        id: uploaded.id,
        url: uploaded.file_url || uploaded.fileUrl,
        name: uploaded.original_name || uploaded.originalName,
        size: uploaded.file_size || uploaded.fileSize,
        type: uploaded.file_type || uploaded.fileType,
        mime: uploaded.mime_type || uploaded.mimeType,
        humanSize: uploaded.human_readable_size || uploaded.humanReadableSize
      } : null,
      createdAt: doc.created_at
    };
  };
}

const onboardingService = new OnboardingService();
export { OnboardingService, onboardingService };
export default onboardingService;