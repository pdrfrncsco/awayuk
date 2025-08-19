#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script avançado para validar traduções
 * Verifica integridade, uso e consistência das traduções
 */

class TranslationValidator {
  constructor() {
    this.localesDir = path.join(__dirname, '../src/locales');
    this.sourceDir = path.join(__dirname, '../src');
    this.supportedLocales = ['pt', 'en'];
    this.issues = [];
  }

  /**
   * Adiciona um problema encontrado
   */
  addIssue(type, severity, message, details = {}) {
    this.issues.push({
      type,
      severity, // 'error', 'warning', 'info'
      message,
      ...details
    });
  }

  /**
   * Carrega arquivo de tradução
   */
  loadTranslations(locale) {
    const filePath = path.join(this.localesDir, `${locale}.json`);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      this.addIssue('file_error', 'error', `Erro ao carregar ${locale}.json`, {
        locale,
        error: error.message
      });
    }
    return {};
  }

  /**
   * Extrai todas as chaves de um objeto aninhado
   */
  extractAllKeys(obj, prefix = '') {
    const keys = new Set();
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        const nestedKeys = this.extractAllKeys(value, fullKey);
        nestedKeys.forEach(k => keys.add(k));
      } else {
        keys.add(fullKey);
      }
    }
    
    return keys;
  }

  /**
   * Obtém valor aninhado usando chave com pontos
   */
  getNestedValue(obj, key) {
    const keys = key.split('.');
    let current = obj;
    
    for (const k of keys) {
      if (!current || typeof current !== 'object' || !(k in current)) {
        return undefined;
      }
      current = current[k];
    }
    
    return current;
  }

  /**
   * Encontra todas as chaves de tradução usadas no código
   */
  findUsedKeys() {
    const usedKeys = new Set();
    const pattern = path.join(this.sourceDir, '**/*.{js,jsx}').replace(/\\/g, '/');
    
    const files = glob.sync(pattern, {
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/locales/**',
        '**/scripts/**'
      ]
    });
    
    files.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const regex = /t\(['"`]([^'"`,)]+)['"`]\)/g;
        let match;
        
        while ((match = regex.exec(content)) !== null) {
          const key = match[1];
          if (key && !key.includes('${')) {
            usedKeys.add(key);
          }
        }
      } catch (error) {
        this.addIssue('file_error', 'warning', `Erro ao analisar ${filePath}`, {
          file: filePath,
          error: error.message
        });
      }
    });
    
    return usedKeys;
  }

  /**
   * Valida estrutura dos arquivos de tradução
   */
  validateStructure() {
    console.log('🔍 Validando estrutura dos arquivos...');
    
    const allTranslations = {};
    const allKeys = new Set();
    
    // Carrega todas as traduções
    for (const locale of this.supportedLocales) {
      allTranslations[locale] = this.loadTranslations(locale);
      const keys = this.extractAllKeys(allTranslations[locale]);
      keys.forEach(key => allKeys.add(key));
    }
    
    // Verifica consistência entre idiomas
    for (const locale of this.supportedLocales) {
      const translations = allTranslations[locale];
      
      for (const key of allKeys) {
        const value = this.getNestedValue(translations, key);
        
        if (value === undefined) {
          this.addIssue('missing_key', 'error', `Chave '${key}' em falta`, {
            locale,
            key
          });
        } else if (typeof value === 'string') {
          // Verifica strings vazias
          if (value.trim() === '') {
            this.addIssue('empty_translation', 'error', `Tradução vazia para '${key}'`, {
              locale,
              key
            });
          }
          
          // Verifica placeholders não traduzidos
          if (locale === 'en' && value.startsWith('[') && value.endsWith(']')) {
            this.addIssue('untranslated_placeholder', 'warning', `Placeholder não traduzido: '${value}'`, {
              locale,
              key,
              value
            });
          }
          
          // Verifica se a tradução é igual à chave (possível erro)
          if (value === key) {
            this.addIssue('key_as_translation', 'warning', `Tradução igual à chave: '${key}'`, {
              locale,
              key
            });
          }
        }
      }
    }
  }

  /**
   * Valida uso das traduções no código
   */
  validateUsage() {
    console.log('🔍 Validando uso das traduções no código...');
    
    const usedKeys = this.findUsedKeys();
    const allTranslations = {};
    const definedKeys = new Set();
    
    // Carrega todas as traduções definidas
    for (const locale of this.supportedLocales) {
      allTranslations[locale] = this.loadTranslations(locale);
      const keys = this.extractAllKeys(allTranslations[locale]);
      keys.forEach(key => definedKeys.add(key));
    }
    
    // Verifica chaves usadas mas não definidas
    for (const key of usedKeys) {
      if (!definedKeys.has(key)) {
        this.addIssue('undefined_key', 'error', `Chave '${key}' usada no código mas não definida`, {
          key
        });
      }
    }
    
    // Verifica chaves definidas mas não usadas
    for (const key of definedKeys) {
      if (!usedKeys.has(key)) {
        this.addIssue('unused_key', 'info', `Chave '${key}' definida mas não usada`, {
          key
        });
      }
    }
    
    console.log(`📊 Chaves usadas no código: ${usedKeys.size}`);
    console.log(`📊 Chaves definidas: ${definedKeys.size}`);
  }

  /**
   * Valida formato e sintaxe
   */
  validateFormat() {
    console.log('🔍 Validando formato e sintaxe...');
    
    for (const locale of this.supportedLocales) {
      const filePath = path.join(this.localesDir, `${locale}.json`);
      
      if (!fs.existsSync(filePath)) {
        this.addIssue('missing_file', 'error', `Arquivo ${locale}.json não encontrado`, {
          locale,
          file: filePath
        });
        continue;
      }
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Verifica se é JSON válido
        JSON.parse(content);
        
        // Verifica formatação (indentação)
        const formatted = JSON.stringify(JSON.parse(content), null, 2);
        if (content.trim() !== formatted) {
          this.addIssue('formatting', 'warning', `Arquivo ${locale}.json não está bem formatado`, {
            locale,
            file: filePath
          });
        }
        
      } catch (error) {
        this.addIssue('invalid_json', 'error', `JSON inválido em ${locale}.json`, {
          locale,
          error: error.message
        });
      }
    }
  }

  /**
   * Gera relatório de validação
   */
  generateReport() {
    const severityCounts = {
      error: 0,
      warning: 0,
      info: 0
    };
    
    const typeGroups = {};
    
    this.issues.forEach(issue => {
      severityCounts[issue.severity]++;
      
      if (!typeGroups[issue.type]) {
        typeGroups[issue.type] = [];
      }
      typeGroups[issue.type].push(issue);
    });
    
    console.log('\n📋 Relatório de Validação:');
    console.log(`   Erros: ${severityCounts.error}`);
    console.log(`   Avisos: ${severityCounts.warning}`);
    console.log(`   Informações: ${severityCounts.info}`);
    
    if (this.issues.length === 0) {
      console.log('\n✅ Todas as validações passaram!');
      return true;
    }
    
    // Mostra problemas por tipo
    for (const [type, issues] of Object.entries(typeGroups)) {
      console.log(`\n${type.toUpperCase().replace('_', ' ')}:`);
      issues.forEach(issue => {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`  ${icon} ${issue.message}`);
        
        if (issue.locale) console.log(`     Idioma: ${issue.locale}`);
        if (issue.key) console.log(`     Chave: ${issue.key}`);
        if (issue.file) console.log(`     Arquivo: ${issue.file}`);
      });
    }
    
    return severityCounts.error === 0;
  }

  /**
   * Executa validação completa
   */
  validate() {
    console.log('🔍 Iniciando validação completa das traduções...');
    
    this.issues = [];
    
    this.validateFormat();
    this.validateStructure();
    this.validateUsage();
    
    const success = this.generateReport();
    
    if (success) {
      console.log('\n🎉 Validação concluída com sucesso!');
      process.exit(0);
    } else {
      console.log('\n❌ Validação falhou. Corrija os problemas encontrados.');
      process.exit(1);
    }
  }

  /**
   * Executa apenas validação rápida (sem análise de uso)
   */
  quickValidate() {
    console.log('🔍 Executando validação rápida...');
    
    this.issues = [];
    
    this.validateFormat();
    this.validateStructure();
    
    const success = this.generateReport();
    
    if (success) {
      console.log('\n✅ Validação rápida passou!');
    } else {
      console.log('\n⚠️ Problemas encontrados na validação rápida.');
    }
    
    return success;
  }
}

// Executa o script se chamado diretamente
if (require.main === module) {
  const validator = new TranslationValidator();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'quick':
      validator.quickValidate();
      break;
    case 'full':
    default:
      validator.validate();
      break;
  }
}

module.exports = TranslationValidator;