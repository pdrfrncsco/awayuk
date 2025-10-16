Builder

Objectivo Da Plataforma

- Conectar a comunidade angolana na diáspora com oportunidades, eventos e serviços.
- Facilitar networking confiável entre membros, profissionais, empresas e organizações.
- Promover visibilidade de talento (portfólio, serviços, testemunhos) e circulação de informação útil.
- Garantir uma experiência segura, moderada e inclusiva, com multilínguas e acessibilidade.

Perfis E Papéis

- Visitante: navega conteúdos públicos, pesquisa básica, visualiza perfis limitados.
- Membro: cria/edita perfil, portfólio e serviços, participa em eventos, candidata-se a oportunidades, envia mensagens.
- Organizador/Empregador: publica eventos e oportunidades; gestão específica dos seus conteúdos.
- Moderador: triagem de denúncias, revisão de conteúdos, ações limitadas de moderação.
- Admin: gestão completa (utilizadores, papéis, conteúdos, categorias), analytics e segurança.
- Super Admin: acesso total a configurações sensíveis e auditoria; uso restrito.

Fluxos De Usuário

- Visitante
  - Descoberta: navega página inicial, pesquisa por serviços, eventos e oportunidades.
  - Conversão: regista-se, valida email, começa onboarding.
- Membro
  - Onboarding: completa perfil (bio, skills, localização, línguas), adiciona serviços/portfólio, preferências.
  - Networking: segue perfis, envia mensagens, participa em eventos, recomendações personalizadas.
  - Oportunidades: pesquisa, aplica, acompanha estado; recebe notificações.
- Organizador/Empregador
  - Publicação: cria eventos/oportunidades, define critérios e prazos, acompanha candidaturas.
  - Gestão: edita, cancela, comunica com participantes/candidatos.
- Moderador/Admin
  - Painel: vê filas de moderação, conteúdo denunciado, métricas.
  - Ações: aprova/recusa, bloqueia, ajusta categorias, gere papéis e verificação.

Matriz De Acesso

- Visitante
  - Acesso: perfis públicos (campos limitados), listas de eventos/oportunidades, testemunhos aprovados.
  - Restrição: sem mensagens, sem candidaturas, sem criação/edição de conteúdos.
- Membro
  - Acesso: perfil próprio completo, criação/edição de serviços/portfólio, candidaturas, RSVP eventos, mensagens.
  - Restrição: moderação limitada; ações administrativas não permitidas.
- Organizador/Empregador
  - Acesso: CRUD de seus eventos/oportunidades, acesso a candidaturas recebidas, comunicação.
  - Restrição: apenas sobre os próprios conteúdos; sem acesso administrativo global.
- Moderador/Admin
  - Acesso: moderação e gestão, analytics, definição de categorias e normas, gestão de papéis.
  - Restrição: auditoria e rastreabilidade obrigatórias; ações sensíveis registradas.

Onboarding E Verificação

- Registo com verificação de email; opcional MFA para maior segurança.
- Questionário inicial para interesses, skills, setores, localizações; melhora recomendações.
- Verificação de prestadores/empregadores (documentos mínimos, prova de entidade) para aumentar confiança.
- Preferências de privacidade e notificações configuráveis, com revisão fácil.
Networking E Conteúdos

- Perfis: campos públicos/privados, idioma, país e cidade, disponibilidade e serviços.
- Portfólio: projetos, mídia otimizada, categorias; controle de visibilidade.
- Testemunhos: pedidos e aprovação; moderação automática/manual para evitar abuso.
- Seguir/Conectar: pedidos com contexto, anti‑spam, limites diários e reputação.

Oportunidades E Eventos

- Oportunidades: filtros (setor, localização, remoto/presencial), requisitos, prazos; candidaturas com CV/portfólio.
- Eventos: calendário, inscrições, lista de participantes visível aos inscritos; opções de networking.
- Processos: aprovação de publicações por moderadores; regras contra fraudes e scams.
- Relatórios: desempenho de posts, taxas de resposta, conversões.

Mensagens E Notificações

- Mensagens: 1‑a‑1 e grupos pequenos com consentimento; rate limit e detecção de abuso.
- Notificações: email e in‑app; preferências, silenciar threads, digests semanais.
- Alertas: novas oportunidades/eventos relevantes, atualizações de candidaturas, respostas a mensagens.

Segurança E Privacidade

- Autenticação: JWT com refresh; rotação e blacklist no logout; sessões por dispositivo.
- Autorização: RBAC + regras por propriedade (owner‑based) e contexto (ABAC leve).
- Proteções: rate limit, throttling, CAPTCHA em registo/login, verificação de domínio de email para organizadores.
- Dados: GDPR/UK DPA — consentimento, exportação, eliminação, políticas de retenção claras.
- Conteúdos: moderação (palavras-chave, reputação), botão de denúncia, resposta rápida e transparente.

Administração E Moderação

- Painel: filas (denúncias, pendentes de aprovação), métricas de engajamento e abuso.
- Ferramentas: ações em massa, histórico de alterações, logs de auditoria.
- Categorias/Taxonomias: gestão central de setores, tags e cidades/países.
- Regras: políticas visíveis, aplicação consistente, feedback ao utilizador.

Observações Técnicas (baseadas no código atual)

- Autenticação: endpoints /api/auth/login/ , /api/auth/profile/ , /api/auth/refresh/ com SimpleJWT; recomendo ativar blacklist e rotação de refresh.
- Perfis/Serviços/Portfólio: rotas em accounts como /accounts/profile/ , /accounts/services/ , /accounts/portfolio/ ; já suportam CRUD e podem limitar por papel.
- Eventos/Oportunidades/Notificações/Analytics: apps dedicados presentes; é viável aplicar RBAC por Group / Permission e criar IsOrganizer / IsEmployer .
- Frontend: VITE_API_URL já parametrizado; mantenha perfis com visibilidade controlada e paginados; i18n existente deve ser reforçado.

Sugestões De Implementação

- Papéis e Permissões: usar Group + permissões DRF custom ( IsOwnerOrReadOnly , IsAdminUser , IsOrganizer ) em cada view.
- Logout Seguro: ativar TokenBlacklist do SimpleJWT e invalidar refresh no endpoint de logout.
- Controlo De Visibilidade: marcar campos do perfil como públicos/privados; endpoint para preferências de privacidade.
- Moderation Pipeline: flag automático + fila manual; aprovação para eventos/oportunidades de novos utilizadores.
- Anti‑Spam: throttling DRF, limites por dia, verificação de conta antes de mensagens em massa.
- Auditoria: logging estruturado (ação, actor, alvo, timestamp) para todas ações administrativas.

Próximos Passos

- Definir claramente a política de papéis e o mapa de permissões por módulo.
- Especificar onboarding e verificação (campos e documentos mínimos) para organizadores/empregadores.
- Implementar blacklist de tokens no backend e gestão de sessões por dispositivo.
- Criar painel de moderação e relatórios essenciais (abuso, engajamento, conversões).
- Revisar UX de pesquisa/filtros e performance (paginação, caching, otimização de imagens).

Se quiser, desenho um quadro detalhado de permissões por endpoint (visitante/membro/organizador/moderador/admin) baseado nas rotas atuais para orientar desenvolvimento e QA.
 
 Onboarding E Verificação (Organizadores/Empregadores)
 
 Objetivo
 
 - Aumentar confiança e reduzir fraude antes de permitir publicação e contacto direto.
 - Garantir conformidade legal (UK/EU) e segurança para membros e participantes.
 
 Níveis De Verificação
 
 - Básico: dados verificados e documentos-chave aceites; desbloqueia publicação limitada.
 - Avançado: validações adicionais (seguros, APIs externas); aumenta limites e visibilidade.
 
 Organizadores De Eventos — Campos Mínimos
 
 - Organização: nome legal, nome comercial, país, cidade, endereço, website (opcional), setor/atividade.
 - Identificação Legal: número de registo (CRN/empresa), VAT (se aplicável), data de constituição.
 - Seguro (PLI): seguradora, número/apólice, cobertura (valor), vigência (início/fim).
 - Representante: nome, email, telefone, cargo.
 - Comunicação: email de suporte/eventos, política de reembolsos (opcional).
 
 Organizadores De Eventos — Documentos Mínimos
 
 - Registro Comercial: certidão de constituição (Companies House) ou relatório de nomeações.
 - Prova de VAT (se aplicável): carta HMRC/VRN.
 - Seguro de Responsabilidade Civil Pública (PLI): certificado com datas e cobertura.
 - Prova de Endereço da Empresa: fatura de serviços/contrato (≤ 3 meses).
 - Identificação do Representante: passaporte/BI/carta de condução.
 
 Empregadores — Campos Mínimos
 
 - Empresa: nome legal, país, cidade, endereço, website (opcional), setor.
 - Identificação Legal: número de registo (CRN/empresa), VAT (se aplicável).
 - Seguro (ELI): seguradora, número/apólice, vigência (início/fim).
 - Compliance: email de contacto GDPR/privacidade, URL de política de privacidade (se disponível).
 - Representante: nome, email, telefone, cargo.
 
 Empregadores — Documentos Mínimos
 
 - Registro Comercial: certidão/relatório Companies House.
 - Employer’s Liability Insurance (ELI): certificado com vigência.
 - Prova de VAT (se aplicável): carta HMRC/VRN.
 - Prova de Endereço da Empresa.
 - Identificação do Representante.
 
 Validações E Fluxo
 
 - Submissão: formulário com campos obrigatórios + upload de documentos.
 - Validações Automáticas: formatos, campos obrigatórios, consistência; opcional verificação CRN/VRN via API.
 - Revisão Manual: cruzamento nome legal ↔ documentos, vigência de seguros, identidade do representante.
 - Estados: pendente, verificado, recusado (com motivo), expirado (revalidação necessária).
 - Revalidação: anual ou conforme validade do seguro (PLI/ELI), com avisos automáticos.
 
 Requisitos De Ficheiros
 
 - Tipos: pdf, jpg, png; tamanho máximo 10MB por ficheiro.
 - Legibilidade: dados chave visíveis; sem cortes/rasuras; permitir upload multi‑página.
 - Metadados: tipo_documento, emissor, número, validade (datas), notas.
 
 Exemplos — Payload (JSON) Organizador
 
 - {
 -   "tipo_aplicante": "organizador",
 -   "organizacao": {
 -     "nome_legal": "AwayUK Events Ltd",
 -     "nome_comercial": "AwayUK",
 -     "registration_number": "12345678",
 -     "vat_number": "GB123456789",
 -     "pais": "UK",
 -     "cidade": "London",
 -     "endereco": "10 Example St, London, SW1A 1AA",
 -     "website": "https://awayuk.co.uk",
 -     "setor": "Eventos"
 -   },
 -   "seguro": {
 -     "tipo": "PLI",
 -     "numero": "PLI-987654",
 -     "vigencia_inicio": "2025-01-01",
 -     "vigencia_fim": "2026-01-01",
 -     "seguradora": "ABC Insurance"
 -   },
 -   "representante": {
 -     "nome": "Maria Silva",
 -     "email": "maria@awayuk.co.uk",
 -     "telefone": "+44 20 1234 5678",
 -     "cargo": "Directora"
 -   },
 -   "documentos": [
 -     {"tipo": "registro_comercial", "arquivo": "..."},
 -     {"tipo": "vat_prova", "arquivo": "..."},
 -     {"tipo": "seguro_pli_certificado", "arquivo": "..."},
 -     {"tipo": "prova_endereco_empresa", "arquivo": "..."},
 -     {"tipo": "id_representante", "arquivo": "..."}
 -   ]
 - }
 
 Endpoints Sugeridos
 
 - POST /accounts/onboarding/apply/ — submissão inicial de dados.
 - POST /accounts/onboarding/{id}/documents/ — upload de documentos.
 - GET /accounts/onboarding/{id}/status/ — acompanhar estado e feedback.
 - POST /accounts/onboarding/{id}/resubmit/ — correções e nova submissão.
 - GET /accounts/onboarding/requirements?tipo=organizador|empregador — requisitos dinâmicos.
 
 Permissões Pós‑Verificação
 
 - ORGANIZER_VERIFIED — permite criar/gerir eventos.
 - EMPLOYER_VERIFIED — permite criar/gerir oportunidades.
 - Integrar com RBAC/DRF existente e logs de auditoria.
 
 Auditoria E Conformidade
 
 - Registar: verificado_por, verificado_em, motivo/nota, histórico de alterações.
 - Acesso restrito a documentos; encriptação em repouso; políticas de retenção.
 - Transparência ao utilizador: motivos de recusa, prazos de revalidação, canal de suporte.
 
 Melhorias Futuras
 
 - OCR para extrair CRN/VRN e datas de seguros.
 - Integração com Companies House, HMRC, seguradoras para validação automática.
 - Fluxo escalonado: verificação básica imediata, avançada sob demanda e limites.