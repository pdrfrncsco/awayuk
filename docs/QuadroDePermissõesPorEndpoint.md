


          
**Quadro De Permissões Por Endpoint**

- `POST /api/auth/register/` Visitante: sim. Membro/Admin: não aplicável. Observação: verificação de email obrigatória.
- `POST /api/auth/login/` Visitante/Membro/Organizador/Admin: sim. Observação: limitar tentativas; CAPTCHA quando necessário.
- `POST /api/auth/logout/` Membro/Organizador/Admin: sim. Visitante: não. Observação: invalidar refresh via TokenBlacklist.
- `GET /api/auth/profile/` Autenticados (todos os papéis): sim, apenas o próprio.
- `PATCH /api/auth/profile/` Autenticados: sim, apenas o próprio. Moderador/Admin: alterações moderadas, auditadas.
- `POST /api/auth/password/reset/` Visitante/Membro: sim. `POST /api/auth/password/reset/confirm/` Visitante/Membro: sim.
- `POST /api/auth/refresh/` Autenticados: sim, com refresh válido; rotação recomendada.

**Perfis E Contas (`accounts`)**

- `GET /accounts/profile/{id}/` Visitante: sim (campos públicos). Membro/Organizador/Admin: sim (mais campos conforme permissões).
- `PATCH /accounts/profile/` Membro/Organizador: sim (apenas o próprio). Moderador/Admin: pode ajustar campos moderados com auditoria.
- `GET /accounts/services/` Visitante: sim (serviços públicos). Membro: sim (inclui privados do próprio).
- `POST /accounts/services/` Membro/Organizador: sim (criar). Visitante: não.
- `PATCH/DELETE /accounts/services/{serviceId}/` Owner: sim. Moderador/Admin: sim (moderação/remover abuso).
- `GET /accounts/portfolio/` Visitante: sim (itens públicos). Membro: sim (todos os seus itens).
- `POST /accounts/portfolio/` Membro/Organizador: sim. `PATCH/DELETE /accounts/portfolio/{portfolioId}/` Owner: sim; Moderador/Admin: sim em casos de violação.
- `GET /accounts/testimonials/{userId}/` Visitante: sim. `POST` de testemunhos: Membro autenticado (com validação de relação/anti‑spam); Moderador/Admin pode remover.

**Uploads**

- `POST /accounts/profile/upload-image/` Membro/Organizador: sim (só próprio). Moderador/Admin: pode remover/banir imagens que violam regras.

**Eventos (`events`)**

- `GET /events/` Visitante/Membro/Organizador/Admin: sim (públicos, filtros).
- `POST /events/` Organizador/Empregador: sim. Visitante/Membro: não (a menos que tenha papel de organizador).
- `PATCH/DELETE /events/{id}/` Owner: sim. Moderador/Admin: sim (moderação).
- `POST /events/{id}/rsvp/` Membro: sim. Visitante: não. Organizador/Admin: gestão de participantes.

**Oportunidades (`opportunities`)**

- `GET /opportunities/` Visitante/Membro/Organizador/Admin: sim (públicas, filtros).
- `POST /opportunities/` Empregador/Organizador: sim. Outros: não.
- `PATCH/DELETE /opportunities/{id}/` Owner: sim. Moderador/Admin: sim (moderação).
- `POST /opportunities/{id}/apply/` Membro: sim. Visitante: não. Organizador/Admin: gestão de candidaturas.

**Notificações (`notifications`)**

- `GET /notifications/` Autenticados: sim (próprio feed).
- `PATCH /notifications/{id}/read` Autenticados: sim (próprio).
- `POST /notifications/` Sistema/Admin: sim (broadcast ou regras). Usuários: não (exceto triggers automáticos).

**Analytics (`analytics`)**

- `GET /analytics/summary` Admin/Moderador: sim. Outros: não.
- `GET /analytics/*` Admin: sim; Moderador: limitado. Logs e auditoria acessíveis conforme papel.

**Conteúdos (`content`)**

- `GET /content/*` Visitante/Membro: sim (públicos). 
- `POST /content/*` Membro/Organizador: sim, sujeito a moderação automática e manual.
- `PATCH/DELETE /content/{id}` Owner: sim. Moderador/Admin: sim (políticas e denúncias).

**Regras Transversais**

- Visibilidade: campos do perfil marcados como públicos/privados; controles por utilizador.
- Propriedade: alterações de `PATCH/DELETE` restritas ao owner; exceções para Moderador/Admin com auditoria.
- RBAC: papéis via `Group` + `Permission` (Visitante sem token; Membro; Organizador/Empregador; Moderador; Admin; Super Admin).
- Rate limits: login, mensagens, criação de conteúdos e publicações têm limites e CAPTCHA conforme risco.
- Verificação: organizadores/empregadores com verificação documental antes de publicar em escala.
- Privacidade: consentimento, exportação e eliminação de dados conforme GDPR/UK DPA.

**Implementação Técnica Sugerida**

- DRF Permissions: `IsAuthenticated`, `IsAdminUser`, `DjangoModelPermissions`, e customs (`IsOwnerOrReadOnly`, `IsOrganizer`, `IsEmployer`, `IsModerator`).
- SimpleJWT: ativar `TokenBlacklist` e rotação de refresh; revogar no logout; expiração diferenciada por dispositivo.
- Throttling: `AnonRateThrottle`, `UserRateThrottle`, classes dedicadas para endpoints sensíveis.
- Auditoria: logging estruturado para ações administrativas/moderação; trilha de alterações em modelos chave.
- Filtros e Paginação: paginação padrão em listas; filtros seguros; caching leve para `GET` públicos.

**Fluxos Por Papel**

- Visitante: navega conteúdos públicos, pesquisa e visualiza perfis limitados; registo/login; sem criação/edição.
- Membro: gestão de perfil/serviços/portfólio, candidaturas e RSVP; mensageria controlada; notificações.
- Organizador/Empregador: publica e gere eventos/oportunidades; comunica com participantes/candidatos; acesso limitado a analytics dos próprios itens.
- Moderador: triagem de denúncias, aprova/retira conteúdos; aplica sanções leves; vê métricas de abuso.
- Admin: gestão de papéis, categorias e políticas; analytics globais; ações sensíveis com auditoria.
- Super Admin: configurações críticas (chaves, integrações, limites globais); acesso raro e altamente auditado.

Posso transformar este quadro em uma política de autorização concreta por viewset (DRF), adicionando as classes de permissão e testes por endpoint para garantir conformidade. Quer que eu avance com um mapeamento direto nos `urls.py` e `views.py` existentes?
        