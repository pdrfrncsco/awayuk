# 🌍 Guia do Sistema de Internacionalização (i18n)

Este guia explica como usar e manter o sistema de traduções da aplicação AWAYSUK.

## 📋 Visão Geral

O sistema de i18n suporta:
- **Português** (idioma principal)
- **Inglês** (idioma secundário)
- Carregamento dinâmico de traduções
- Persistência da preferência do utilizador
- Scripts automatizados para manutenção

## 🚀 Comandos Disponíveis

### Comandos Principais

```bash
# Atualização completa (extrai + sincroniza + valida)
npm run i18n:update

# Mostra estatísticas das traduções
npm run i18n:stats

# Ajuda e lista de comandos
npm run i18n help
```

### Comandos Específicos

```bash
# Extrai chaves de tradução do código
npm run i18n:extract

# Sincroniza traduções entre idiomas
npm run i18n:sync

# Valida integridade das traduções
npm run i18n:validate

# Verificação rápida para build
npm run i18n:build-check
```

### Opções

```bash
# Saída detalhada
npm run i18n:update -- --verbose

# Saída mínima
npm run i18n:stats -- --quiet
```

## 📁 Estrutura de Arquivos

```
src/
├── locales/
│   ├── pt.json          # Traduções em português
│   └── en.json          # Traduções em inglês
├── contexts/
│   └── I18nContext.jsx  # Contexto de internacionalização
├── hooks/
│   └── useTranslation.js # Hook para usar traduções
└── components/
    └── LanguageSelector.jsx # Seletor de idioma

scripts/
├── extract-translations.js  # Extrai chaves do código
├── sync-translations.js     # Sincroniza entre idiomas
├── validate-translations.js # Valida traduções
└── i18n-manager.js         # Script principal
```

## 💻 Como Usar no Código

### 1. Importar o Hook

```jsx
import { useTranslation } from '../hooks/useTranslation';
```

### 2. Usar Traduções

```jsx
function MeuComponente() {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button onClick={() => changeLanguage('en')}>
        {t('common.language')}
      </button>
    </div>
  );
}
```

### 3. Traduções com Parâmetros

```jsx
// No arquivo de tradução:
{
  "welcome": "Bem-vindo, {{name}}!"
}

// No componente:
const message = t('welcome', { name: 'João' });
// Resultado: "Bem-vindo, João!"
```

## 📝 Estrutura das Traduções

As traduções são organizadas hierarquicamente:

```json
{
  "common": {
    "login": "Entrar",
    "logout": "Sair",
    "save": "Guardar"
  },
  "navigation": {
    "home": "Início",
    "about": "Sobre",
    "contact": "Contacto"
  },
  "hero": {
    "title": "Título Principal",
    "subtitle": "Subtítulo"
  }
}
```

## 🔄 Fluxo de Trabalho

### Para Desenvolvedores

1. **Adicionar nova tradução:**
   ```jsx
   // Use a chave no código
   <button>{t('buttons.submit')}</button>
   ```

2. **Extrair e sincronizar:**
   ```bash
   npm run i18n:update
   ```

3. **Traduzir para inglês:**
   - Abra `src/locales/en.json`
   - Substitua `[buttons.submit]` pela tradução

4. **Validar:**
   ```bash
   npm run i18n:validate
   ```

### Para Tradutores

1. **Ver estatísticas:**
   ```bash
   npm run i18n:stats
   ```

2. **Encontrar traduções em falta:**
   - Procure por `[chave]` nos arquivos JSON
   - Substitua pela tradução apropriada

3. **Validar trabalho:**
   ```bash
   npm run i18n:validate
   ```

## 🛠️ Scripts Automatizados

### extract-translations.js
- Procura por `t('chave')` no código
- Adiciona novas chaves aos arquivos JSON
- Mantém traduções existentes

### sync-translations.js
- Garante que todos os idiomas têm as mesmas chaves
- Adiciona placeholders para traduções em falta
- Remove chaves órfãs

### validate-translations.js
- Verifica JSON válido
- Encontra chaves em falta
- Identifica traduções não utilizadas
- Valida formatação

### i18n-manager.js
- Script principal que integra todos os outros
- Fornece interface unificada
- Suporta diferentes modos de operação

## 🚨 Resolução de Problemas

### Erro: "Tradução não encontrada"
```bash
# Extraia e sincronize traduções
npm run i18n:update
```

### Erro: "JSON inválido"
```bash
# Valide a sintaxe dos arquivos
npm run i18n:validate
```

### Build falha por traduções
```bash
# Verifique problemas críticos
npm run i18n:build-check
```

### Chaves não utilizadas
```bash
# Veja relatório completo
npm run i18n:validate
```

## 📊 Monitorização

### Verificar Cobertura
```bash
npm run i18n:stats
```

### Validação Contínua
O comando `build` automaticamente executa `i18n:build-check` para garantir que não há erros críticos.

### Integração CI/CD
Adicione ao pipeline:
```yaml
- name: Validate translations
  run: npm run i18n:build-check
```

## 🎯 Melhores Práticas

1. **Nomeação de Chaves:**
   - Use hierarquia: `section.subsection.key`
   - Seja descritivo: `buttons.submit` vs `btn1`
   - Mantenha consistência

2. **Organização:**
   - Agrupe por funcionalidade
   - Use prefixos consistentes
   - Evite aninhamento excessivo

3. **Manutenção:**
   - Execute `npm run i18n:update` regularmente
   - Valide antes de commits importantes
   - Mantenha traduções atualizadas

4. **Performance:**
   - Traduções são carregadas dinamicamente
   - Cache automático no localStorage
   - Fallback para português em caso de erro

## 🔗 Recursos Adicionais

- [React i18n Best Practices](https://react.i18next.com/)
- [JSON Schema Validation](https://json-schema.org/)
- [Internationalization Guidelines](https://developer.mozilla.org/en-US/docs/Mozilla/Localization)

---

**Nota:** Este sistema foi projetado para ser simples e eficiente. Para necessidades mais complexas (pluralização, formatação de datas, etc.), considere migrar para uma biblioteca como `react-i18next`.