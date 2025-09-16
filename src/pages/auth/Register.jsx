import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validação em tempo real da força da password
  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      return strength;
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  // Validação em tempo real do formulário
  useEffect(() => {
    const isValid = 
      formData.username.length >= 3 &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.first_name.trim() &&
      formData.last_name.trim() &&
      formData.password.length >= 8 &&
      formData.password === formData.password_confirm &&
      formData.agreeTerms;
    
    setIsFormValid(isValid);
  }, [formData]);

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

  const validateForm = () => {
    const newErrors = {};

    // Validação do username
    if (!formData.username.trim()) {
      newErrors.username = 'Username é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username só pode conter letras, números e underscore';
    }

    // Validação do email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação do nome
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Nome é obrigatório';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação do apelido
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Apelido é obrigatório';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'Apelido deve ter pelo menos 2 caracteres';
    }

    // Validação da password
    if (!formData.password) {
      newErrors.password = 'Password é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password deve ter pelo menos 8 caracteres';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password muito fraca. Use letras maiúsculas, minúsculas e números';
    }

    // Validação da confirmação de password
    if (!formData.password_confirm) {
      newErrors.password_confirm = 'Confirmação de password é obrigatória';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords não coincidem';
    }

    // Validação dos termos
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Deve aceitar os termos e condições';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Preparar dados para o backend
      const registrationData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        password_confirm: formData.password_confirm
      };

      const result = await register(registrationData);
      
      if (result.success) {
        setRegistrationSuccess(true);
        
        // Redirecionar após 4 segundos
        setTimeout(() => {
          navigate('/verificar-email');
        }, 4000);
      } else {
        setErrors({ general: result.error || 'Erro ao criar conta. Tente novamente.' });
      }
      
    } catch (error) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Muito fraca';
    if (passwordStrength <= 2) return 'Fraca';
    if (passwordStrength <= 3) return 'Média';
    return 'Forte';
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Conta Criada com Sucesso!</h2>
            <p className="text-gray-600 mb-4">
              A sua conta foi criada. Verifique o seu email para ativar a conta.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-blue-800 text-sm">
                  Enviámos um email de verificação para <strong>{formData.email}</strong>
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">A redirecionar para a página de verificação...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 mb-4">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h2>
          <p className="text-gray-600">Junte-se à comunidade AWAYSUK</p>
        </div>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-800 text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                    errors.username ? 'border-red-300 bg-red-50' : 
                    formData.username && !errors.username ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Escolha um username"
                />
                {formData.username && !errors.username && formData.username.length >= 3 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.username}
                </p>
              )}
              {formData.username && !errors.username && (
                <p className="mt-1 text-sm text-green-600">Username disponível</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 
                    formData.email && /\S+@\S+\.\S+/.test(formData.email) ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="seu.email@exemplo.com"
                />
                {formData.email && /\S+@\S+\.\S+/.test(formData.email) && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Nome e Apelido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                    errors.first_name ? 'border-red-300 bg-red-50' : 
                    formData.first_name && formData.first_name.length >= 2 ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Seu nome"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Apelido *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                    errors.last_name ? 'border-red-300 bg-red-50' : 
                    formData.last_name && formData.last_name.length >= 2 ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Seu apelido"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Escolha uma password segura"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Indicador de força da password */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Use pelo menos 8 caracteres com letras maiúsculas, minúsculas e números
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmação de Password */}
            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
                    errors.password_confirm ? 'border-red-300 bg-red-50' : 
                    formData.password_confirm && formData.password === formData.password_confirm ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirme a sua password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {formData.password_confirm && formData.password === formData.password_confirm && (
                  <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.password_confirm && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.password_confirm}
                </p>
              )}
              {formData.password_confirm && formData.password === formData.password_confirm && (
                <p className="mt-1 text-sm text-green-600">Passwords coincidem</p>
              )}
            </div>

            {/* Termos e Condições */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-gray-700">
                  Aceito os{' '}
                  <Link to="/termos" className="text-yellow-600 hover:text-yellow-500 font-medium">
                    Termos e Condições
                  </Link>{' '}
                  e a{' '}
                  <Link to="/privacidade" className="text-yellow-600 hover:text-yellow-500 font-medium">
                    Política de Privacidade
                  </Link>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.agreeTerms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors ${
              isLoading || !isFormValid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
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

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
              >
                Entrar na conta
              </Link>
            </p>
          </div>

          {/* Informação Adicional */}
          <div className="mt-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Bem-vindo à Comunidade AWAYSUK</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Conecte-se com angolanos no Reino Unido</li>
                <li>• Acesso a eventos exclusivos da comunidade</li>
                <li>• Oportunidades de emprego e negócios</li>
                <li>• Suporte e orientação para novos residentes</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;