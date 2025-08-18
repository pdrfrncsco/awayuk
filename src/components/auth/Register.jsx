import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados Pessoais
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Localização
    currentCity: '',
    postcode: '',
    originProvince: '',
    
    // Informações da Comunidade
    arrivalYear: '',
    profession: '',
    interests: [],
    languagesSpoken: [],
    
    // Conta
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    receiveUpdates: true
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const provinces = [
    'Luanda', 'Benguela', 'Huíla', 'Bié', 'Moxico', 'Lunda Norte', 'Lunda Sul',
    'Malanje', 'Uíge', 'Zaire', 'Cabinda', 'Cuando Cubango', 'Cunene',
    'Huambo', 'Namibe', 'Bengo', 'Cuanza Norte', 'Cuanza Sul'
  ];

  const interestOptions = [
    'Cultura Angolana', 'Música', 'Dança', 'Culinária', 'Desporto', 'Negócios',
    'Tecnologia', 'Educação', 'Saúde', 'Arte', 'Literatura', 'Turismo',
    'Voluntariado', 'Networking', 'Eventos Sociais'
  ];

  const languageOptions = [
    'Português', 'Inglês', 'Kimbundu', 'Umbundu', 'Kikongo', 'Chokwe',
    'Nganguela', 'Kwanyama', 'Nyaneka', 'Fiote'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro quando o utilizador começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [name]: newValues
      };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validação dos dados pessoais
      if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório';
      if (!formData.lastName.trim()) newErrors.lastName = 'Apelido é obrigatório';
      if (!formData.email) {
        newErrors.email = 'Email é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória';
      if (!formData.gender) newErrors.gender = 'Género é obrigatório';
    }

    if (step === 2) {
      // Validação da localização
      if (!formData.currentCity.trim()) newErrors.currentCity = 'Cidade atual é obrigatória';
      if (!formData.postcode.trim()) newErrors.postcode = 'Código postal é obrigatório';
      if (!formData.originProvince) newErrors.originProvince = 'Província de origem é obrigatória';
    }

    if (step === 3) {
      // Validação das informações da comunidade
      if (!formData.arrivalYear) newErrors.arrivalYear = 'Ano de chegada é obrigatório';
      if (!formData.profession.trim()) newErrors.profession = 'Profissão é obrigatória';
      if (formData.interests.length === 0) newErrors.interests = 'Selecione pelo menos um interesse';
      if (formData.languagesSpoken.length === 0) newErrors.languagesSpoken = 'Selecione pelo menos um idioma';
    }

    if (step === 4) {
      // Validação da conta
      if (!formData.password) {
        newErrors.password = 'Password é obrigatória';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password deve ter pelo menos 8 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password deve conter pelo menos uma letra minúscula, uma maiúscula e um número';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de password é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords não coincidem';
      }
      
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Deve aceitar os termos e condições';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      return;
    }

    try {
      const result = await register(formData);
      
      if (result.success) {
        setRegistrationSuccess(true);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ general: result.error || 'Erro ao criar conta. Tente novamente.' });
      }
      
    } catch (error) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Conta Criada!</h2>
            <p className="text-gray-600 mb-4">Bem-vindo à comunidade AWAYSUK!</p>
            <p className="text-sm text-gray-500">Verifique o seu email para ativar a conta.</p>
            <p className="text-sm text-gray-500 mt-2">A redirecionar para o login...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            step <= currentStep
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-yellow-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Seu nome"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apelido *</label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Seu apelido"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="seu.email@exemplo.com"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PhoneIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="+44 7xxx xxx xxx"
          />
        </div>
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Género *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="prefiro_nao_dizer">Prefiro não dizer</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Localização</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade Atual *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="currentCity"
              type="text"
              value={formData.currentCity}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.currentCity ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Londres, Manchester, etc."
            />
          </div>
          {errors.currentCity && <p className="mt-1 text-sm text-red-600">{errors.currentCity}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
          <input
            name="postcode"
            type="text"
            value={formData.postcode}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.postcode ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="SW1A 1AA"
          />
          {errors.postcode && <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Província de Origem em Angola *</label>
        <select
          name="originProvince"
          value={formData.originProvince}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
            errors.originProvince ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">Selecione a província</option>
          {provinces.map(province => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
        {errors.originProvince && <p className="mt-1 text-sm text-red-600">{errors.originProvince}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Comunidade</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Chegada ao Reino Unido *</label>
          <input
            name="arrivalYear"
            type="number"
            min="1950"
            max={new Date().getFullYear()}
            value={formData.arrivalYear}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.arrivalYear ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="2020"
          />
          {errors.arrivalYear && <p className="mt-1 text-sm text-red-600">{errors.arrivalYear}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profissão *</label>
          <input
            name="profession"
            type="text"
            value={formData.profession}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.profession ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Engenheiro, Professor, etc."
          />
          {errors.profession && <p className="mt-1 text-sm text-red-600">{errors.profession}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Interesses *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {interestOptions.map(interest => (
            <label key={interest} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleMultiSelectChange('interests', interest)}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{interest}</span>
            </label>
          ))}
        </div>
        {errors.interests && <p className="mt-1 text-sm text-red-600">{errors.interests}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Idiomas que Fala *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languageOptions.map(language => (
            <label key={language} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.languagesSpoken.includes(language)}
                onChange={() => handleMultiSelectChange('languagesSpoken', language)}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
        {errors.languagesSpoken && <p className="mt-1 text-sm text-red-600">{errors.languagesSpoken}</p>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Criar Conta</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Mínimo 8 caracteres"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        <p className="mt-1 text-xs text-gray-500">
          A password deve conter pelo menos 8 caracteres, incluindo uma letra minúscula, uma maiúscula e um número.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Password *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Repita a password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      <div className="space-y-3">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            name="agreeTerms"
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded mt-1"
          />
          <span className="text-sm text-gray-700">
            Aceito os{' '}
            <Link to="/termos" className="text-yellow-600 hover:text-yellow-500 underline">
              Termos e Condições
            </Link>{' '}
            e a{' '}
            <Link to="/privacidade" className="text-yellow-600 hover:text-yellow-500 underline">
              Política de Privacidade
            </Link>
            {' '}*
          </span>
        </label>
        {errors.agreeTerms && <p className="text-sm text-red-600">{errors.agreeTerms}</p>}
        
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            name="receiveUpdates"
            type="checkbox"
            checked={formData.receiveUpdates}
            onChange={handleInputChange}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded mt-1"
          />
          <span className="text-sm text-gray-700">
            Quero receber atualizações sobre eventos e oportunidades da comunidade
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 mb-4">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Juntar-se à Comunidade</h2>
          <p className="text-gray-600">Crie a sua conta na comunidade AWAYSUK</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-800 text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg hover:from-red-700 hover:to-yellow-600 transition-colors"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg text-white transition-colors ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        A criar conta...
                      </div>
                    ) : (
                      'Criar Conta'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Link para Login */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Já tem conta?{' '}
              <Link
                to="/login"
                className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
              >
                Entrar na conta
              </Link>
            </p>
          </div>
        </div>

        {/* Informação Adicional */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">Porquê Juntar-se à AWAYSUK?</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• <strong>Rede de Contactos:</strong> Conecte-se com angolanos em todo o Reino Unido</li>
                  <li>• <strong>Oportunidades:</strong> Acesso exclusivo a vagas de emprego e negócios</li>
                  <li>• <strong>Eventos:</strong> Participe em eventos culturais e sociais da comunidade</li>
                  <li>• <strong>Suporte:</strong> Orientação e apoio para novos residentes</li>
                  <li>• <strong>Cultura:</strong> Mantenha-se conectado às suas raízes angolanas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;