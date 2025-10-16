import React, { useEffect, useState } from 'react';
import { services } from '../../services';
import { CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const TestimonialsModeration = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [approvingId, setApprovingId] = useState(null);

  const loadPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await services.profile.getPendingTestimonials();
      setTestimonials(Array.isArray(data) ? data : (data?.results || []));
    } catch (err) {
      console.error('Erro ao carregar testemunhos pendentes:', err);
      setError('Erro ao carregar testemunhos pendentes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      await services.profile.moderateTestimonial(id, true);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Erro ao aprovar testemunho:', err);
      alert('Falha ao aprovar. Tente novamente.');
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Moderação de Avaliações</h2>
        <button
          onClick={loadPending}
          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-600">A carregar testemunhos...</div>
      ) : error ? (
        <div className="py-10 text-center text-red-600">{error}</div>
      ) : testimonials.length === 0 ? (
        <div className="py-10 text-center text-gray-600">Não há testemunhos pendentes.</div>
      ) : (
        <div className="space-y-4">
          {testimonials.map(t => (
            <div key={t.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>De: {t.reviewer_name || t.reviewer_username || 'Anónimo'}</span>
                    <span>•</span>
                    <span>Para usuário ID: {t.user || 'Anónimo'}</span>
                    {t.created_at && (
                      <>
                        <span>•</span>
                        <span>{new Date(t.created_at).toLocaleString('pt-PT')}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-yellow-600">Avaliação: {t.rating}/5</div>
                  {t.comment && (
                    <p className="mt-2 text-gray-800">{t.comment}</p>
                  )}
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleApprove(t.id)}
                    disabled={approvingId === t.id}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${approvingId === t.id ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {approvingId === t.id ? 'A aprovar...' : 'Aprovar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsModeration;