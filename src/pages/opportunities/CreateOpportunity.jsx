import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../../services';
import { useNotifications, NOTIFICATION_TYPES, NOTIFICATION_CATEGORIES } from '../../contexts/NotificationsContext';

function CreateOpportunity() {
  const navigate = useNavigate();
  const { addNotification, showToast } = useNotifications();
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    title: '',
    company_name: '',
    location_city: '',
    location_country: 'Reino Unido',
    type: '',
    category: '',
    experience_level: '',
    work_type: 'onsite',
    salaryMin: '',
    salaryMax: '',
    salary_currency: 'GBP',
    application_deadline: '',
    description: '',
    skills_required: '',
    benefits: '',
    contact_email: '',
    contact_phone: '',
    application_url: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadMeta() {
      try {
        setLoading(true);
        const [t, c] = await Promise.all([
          services.opportunities.getOpportunityTypes?.(),
          services.opportunities.getOpportunityCategories?.()
        ]);
        const defaultTypes = [
          { value: 'job', label: 'Emprego' },
          { value: 'internship', label: 'Estágio' },
          { value: 'freelance', label: 'Freelance' },
          { value: 'partnership', label: 'Parceria' },
          { value: 'investment', label: 'Investimento' },
          { value: 'collaboration', label: 'Colaboração' },
          { value: 'mentorship', label: 'Mentoria' },
          { value: 'volunteer', label: 'Voluntariado' }
        ];
        // Tipos: fallback para lista estática se endpoint não existir
        setTypes(Array.isArray(t) && t.length
          ? t.map(x => (x?.value ? x : { value: x, label: String(x) }))
          : defaultTypes);
        // Categorias: mapear id/name do backend para value/label
        setCategories(Array.isArray(c)
          ? c.map(cat => ({ value: cat.id, label: cat.name }))
          : []);
      } catch (e) {
        console.warn('Falha ao carregar tipos/categorias de oportunidades:', e);
        // Fallback para tipos quando falhar
        setTypes([
          { value: 'job', label: 'Emprego' },
          { value: 'internship', label: 'Estágio' },
          { value: 'freelance', label: 'Freelance' },
          { value: 'partnership', label: 'Parceria' },
          { value: 'investment', label: 'Investimento' },
          { value: 'collaboration', label: 'Colaboração' },
          { value: 'mentorship', label: 'Mentoria' },
          { value: 'volunteer', label: 'Voluntariado' }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadMeta();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  function validate() {
    const next = {};
    if (!form.title?.trim()) next.title = 'Título é obrigatório';
    if (!form.company_name?.trim()) next.company_name = 'Empresa é obrigatória';
    if (!form.location_city?.trim()) next.location_city = 'Cidade é obrigatória';
    if (!form.type?.trim()) next.type = 'Tipo é obrigatório';
    if (!form.category?.trim()) next.category = 'Categoria é obrigatória';
    if (!form.experience_level?.trim()) next.experience_level = 'Nível é obrigatório';
    if (!form.work_type?.trim()) next.work_type = 'Regime é obrigatório';
    if (!form.description?.trim()) next.description = 'Descrição é obrigatória';
    if (!form.skills_required?.trim()) next.skills_required = 'Requisitos são obrigatórios';
    if (!form.contact_email?.trim()) next.contact_email = 'Email de contacto é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) next.contact_email = 'Email inválido';
    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax)) {
      next.salaryMax = 'Salário máximo deve ser maior que o mínimo';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        company_name: form.company_name,
        location_city: form.location_city,
        location_country: form.location_country || 'Reino Unido',
        type: form.type,
        category: form.category, // deve ser o ID da categoria
        work_type: form.work_type,
        experience_level: form.experience_level,
        skills_required: form.skills_required ? form.skills_required.trim() : undefined,
        benefits: form.benefits ? form.benefits.trim() : undefined,
        salary_min: form.salaryMin ? Number(form.salaryMin) : undefined,
        salary_max: form.salaryMax ? Number(form.salaryMax) : undefined,
        salary_currency: form.salary_currency || 'GBP',
        // Backend espera DateTime; se o utilizador escolher apenas a data,
        // definir para o final do dia para evitar validação com timezone.
        application_deadline: form.application_deadline
          ? new Date(`${form.application_deadline}T23:59:59`).toISOString()
          : undefined,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone || undefined,
        application_url: form.application_url || undefined,
      };

      const created = await services.opportunities.createOpportunity(payload);
      setSuccess('Oportunidade criada com sucesso');

      // Toast de sucesso imediato
      showToast({
        type: NOTIFICATION_TYPES.OPPORTUNITY,
        title: 'Oportunidade criada',
        message: 'A sua oportunidade foi enviada para aprovação. Receberá uma notificação quando for aprovada.',
        actionUrl: '/dashboard/oportunidades'
      });

      // Notificação in-app para acompanhar o processo
      addNotification({
        category: NOTIFICATION_CATEGORIES.OPPORTUNITY,
        type: NOTIFICATION_TYPES.INFO,
        title: 'Oportunidade enviada para aprovação',
        message: 'Aguardando validação do admin. Iremos atualizar o status assim que houver mudanças.',
        actionUrl: '/dashboard/oportunidades'
      });

      setTimeout(() => navigate('/dashboard/oportunidades'), 350);
      return created;
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Falha ao criar a oportunidade');

      // Toast de erro
      showToast({
        type: NOTIFICATION_TYPES.ERROR,
        title: 'Erro ao criar oportunidade',
        message: e?.message || 'Tente novamente mais tarde.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-5xl mx-auto px-4 py-8'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-gray-900'>Criar Nova Oportunidade</h1>
          <p className='text-sm text-gray-600'>Divulgue oportunidades de emprego ou negócio à comunidade.</p>
        </div>

        {error && (
          <div className='mb-4 rounded-md bg-red-50 p-4 text-red-700'>{error}</div>
        )}
        {success && (
          <div className='mb-4 rounded-md bg-green-50 p-4 text-green-700'>{success}</div>
        )}

        <form onSubmit={handleSubmit} className='bg-white shadow rounded-lg p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Título *</label>
              <input name='title' value={form.title} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
              {errors.title && <p className='mt-1 text-xs text-red-600'>{errors.title}</p>}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Empresa *</label>
              <input name='company_name' value={form.company_name} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
              {errors.company_name && <p className='mt-1 text-xs text-red-600'>{errors.company_name}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>País</label>
              <input name='location_country' value={form.location_country} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Cidade *</label>
              <input name='location_city' value={form.location_city} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
              {errors.location_city && <p className='mt-1 text-xs text-red-600'>{errors.location_city}</p>}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Tipo *</label>
              <select name='type' value={form.type} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'>
                <option value=''>Selecione...</option>
                {types?.map((t, i) => (
                  <option key={i} value={t?.value || t}>{t?.label || t}</option>
                ))}
              </select>
              {errors.type && <p className='mt-1 text-xs text-red-600'>{errors.type}</p>}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Categoria *</label>
              <select name='category' value={form.category} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'>
                <option value=''>Selecione...</option>
                {categories?.map((c, i) => (
                  <option key={i} value={c?.value || c}>{c?.label || c}</option>
                ))}
              </select>
              {errors.category && <p className='mt-1 text-xs text-red-600'>{errors.category}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Moeda</label>
              <select name='salary_currency' value={form.salary_currency} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'>
                <option value='GBP'>Libra Esterlina (GBP)</option>
                <option value='EUR'>Euro (EUR)</option>
                <option value='USD'>Dólar (USD)</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Nível *</label>
              <select name='experience_level' value={form.experience_level} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'>
                <option value=''>Selecione...</option>
                <option value='entry'>Iniciante</option>
                <option value='junior'>Júnior</option>
                <option value='mid'>Intermédio</option>
                <option value='senior'>Sénior</option>
                <option value='executive'>Executivo</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Regime *</label>
              <select name='work_type' value={form.work_type} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'>
                <option value=''>Selecione...</option>
                <option value='onsite'>Presencial</option>
                <option value='hybrid'>Híbrido</option>
                <option value='remote'>Remoto</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Prazo (deadline)</label>
              <input name='application_deadline' type='date' value={form.application_deadline} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Salário mínimo</label>
              <input name='salaryMin' type='number' min='0' value={form.salaryMin} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Salário máximo</label>
              <input name='salaryMax' type='number' min='0' value={form.salaryMax} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
              {errors.salaryMax && <p className='mt-1 text-xs text-red-600'>{errors.salaryMax}</p>}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email de contacto *</label>
              <input name='contact_email' type='email' value={form.contact_email} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
              {errors.contact_email && <p className='mt-1 text-xs text-red-600'>{errors.contact_email}</p>}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Descrição *</label>
            <textarea name='description' rows={4} value={form.description} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
            {errors.description && <p className='mt-1 text-xs text-red-600'>{errors.description}</p>}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Requisitos (um por linha) *</label>
              <textarea name='skills_required' rows={3} value={form.skills_required} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
              {errors.skills_required && <p className='mt-1 text-xs text-red-600'>{errors.skills_required}</p>}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Benefícios (um por linha)</label>
              <textarea name='benefits' rows={3} value={form.benefits} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Telefone de contacto</label>
              <input name='contact_phone' value={form.contact_phone} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>URL de candidatura</label>
              <input name='application_url' type='url' value={form.application_url} onChange={handleChange} className='mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500' />
            </div>
          </div>

          <div className='flex justify-end gap-3 pt-4'>
            <button type='button' onClick={() => navigate(-1)} className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'>Cancelar</button>
            <button type='submit' disabled={loading} className='px-4 py-2 rounded-md border border-transparent text-white bg-red-600 hover:bg-red-700 disabled:opacity-50'>
              {loading ? 'A criar...' : 'Criar Oportunidade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOpportunity;