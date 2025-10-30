import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Video, Users, FileText, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user';

interface AMAScheduleForm {
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  youtubeUrl: string;
  moderatorName: string;
  price: number;
  isFirstFree: boolean;
}

/**
 * Página para donos de projetos agendarem AMAs
 * Permite configurar todos os detalhes da AMA incluindo data, horário, preço e moderador
 */
export default function ScheduleAMAPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<AMAScheduleForm>({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    youtubeUrl: '',
    moderatorName: '',
    price: 0,
    isFirstFree: true
  });

  // Verificar se o usuário pode agendar AMAs
  const canScheduleAMA = user && ["project", "admin"].includes(user.role);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('AMA agendada:', {
        ...formData,
        projectId: user?.id,
        scheduledDateTime: new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
      });
      
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          scheduledDate: '',
          scheduledTime: '',
          duration: 60,
          youtubeUrl: '',
          moderatorName: '',
          price: 0,
          isFirstFree: true
        });
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao agendar AMA:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canScheduleAMA) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-grafite-900 flex items-center justify-center">
        <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Apenas donos de projetos podem agendar AMAs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-grafite-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Agendar AMA
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure os detalhes da sua AMA e agende uma sessão com a comunidade
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  AMA agendada com sucesso!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div className="border-b border-gray-200 dark:border-grafite-700 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informações Básicas
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título da AMA *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent dark:bg-grafite-700 dark:text-white"
                    placeholder="Ex: AMA - Revolução DeFi: O Futuro das Finanças"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent dark:bg-grafite-700 dark:text-white"
                    placeholder="Descreva o que será discutido na AMA..."
                  />
                </div>
              </div>
            </div>

            {/* Data e Horário */}
            <div className="border-b border-gray-200 dark:border-grafite-700 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Data e Horário
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    required
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent dark:bg-grafite-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Horário *
                  </label>
                  <input
                    type="time"
                    id="scheduledTime"
                    name="scheduledTime"
                    required
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent dark:bg-grafite-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duração (minutos) *
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent dark:bg-grafite-700 dark:text-white"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                    <option value={90}>90 minutos</option>
                    <option value={120}>120 minutos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Configurações da Transmissão */}
            <div className="border-b border-gray-200 dark:border-grafite-700 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Transmissão
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL do YouTube (opcional)
                  </label>
                  <input
                    type="url"
                    id="youtubeUrl"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent dark:bg-grafite-700 dark:text-white"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label htmlFor="moderatorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Moderador *
                  </label>
                  <input
                    type="text"
                    id="moderatorName"
                    name="moderatorName"
                    required
                    value={formData.moderatorName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent dark:bg-grafite-700 dark:text-white"
                    placeholder="Nome do moderador da AMA"
                  />
                </div>
              </div>
            </div>

            {/* Preço */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Configuração de Preço
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFirstFree"
                    name="isFirstFree"
                    checked={formData.isFirstFree}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-roxo-600 focus:ring-roxo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFirstFree" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Esta é minha primeira AMA (gratuita)
                  </label>
                </div>

                {!formData.isFirstFree && (
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preço (USD) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      required={!formData.isFirstFree}
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent dark:bg-grafite-700 dark:text-white"
                      placeholder="200.00"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      AMAs adicionais custam $200 USD
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-roxo-600 hover:bg-roxo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-roxo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Agendando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Agendar AMA
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}