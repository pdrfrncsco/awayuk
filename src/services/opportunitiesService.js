// Wrapper de compatibilidade: reexporta o serviço canónico
import opportunityService, { OpportunityService as BaseOpportunityService } from './opportunityService.js';

// Manter nomes de exportação existentes apontando para a mesma instância
const opportunitiesServiceInstance = opportunityService;

// Expor a classe para compatibilidade (herda da classe base)
class OpportunitiesService extends BaseOpportunityService {}

export { opportunitiesServiceInstance, OpportunitiesService };
export default opportunitiesServiceInstance;