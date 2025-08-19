#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para sincronizar traduções entre idiomas
 * Garante que todos os idiomas tenham as mesmas chaves
 */

class TranslationSyncer {
  constructor() {
    this.localesDir = path.join(__dirname, '../src/locales');
    this.supportedLocales = ['pt', 'en'];
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
      console.error(`❌ Erro ao carregar ${locale}.json:`, error.message);
    }
    return {};
  }

  /**
   * Salva arquivo de tradução
   */
  saveTranslations(locale, translations) {
    const filePath = path.join(this.localesDir, `${locale}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`❌ Erro ao salvar ${locale}.json:`, error.message);
      return false;
    }
  }

  /**
   * Extrai todas as chaves de um objeto aninhado
   */
  extractAllKeys(obj, prefix = '') {
    const keys = new Set();
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        // Recursivo para objetos aninhados
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
   * Define valor aninhado usando chave com pontos
   */
  setNestedValue(obj, key, value) {
    const keys = key.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
  }

  /**
   * Remove chaves órfãs (que não existem em outros idiomas)
   */
  removeOrphanKeys(translations, allKeys) {
    const cleaned = {};
    
    for (const key of allKeys) {
      const value = this.getNestedValue(translations, key);
      if (value !== undefined) {
        this.setNestedValue(cleaned, key, value);
      }
    }
    
    return cleaned;
  }

  /**
   * Encontra chaves em falta em um idioma
   */
  findMissingKeys(translations, allKeys) {
    const missing = [];
    
    for (const key of allKeys) {
      const value = this.getNestedValue(translations, key);
      if (value === undefined) {
        missing.push(key);
      }
    }
    
    return missing;
  }

  /**
   * Sincroniza traduções entre idiomas
   */
  sync() {
    console.log('🔄 Sincronizando traduções...');
    
    // Carrega todas as traduções
    const allTranslations = {};
    const allKeys = new Set();
    
    for (const locale of this.supportedLocales) {
      allTranslations[locale] = this.loadTranslations(locale);
      const keys = this.extractAllKeys(allTranslations[locale]);
      keys.forEach(key => allKeys.add(key));
    }
    
    console.log(`🔑 Total de chaves únicas encontradas: ${allKeys.size}`);
    
    // Sincroniza cada idioma
    const results = {};
    
    for (const locale of this.supportedLocales) {
      const translations = allTranslations[locale];
      const missing = this.findMissingKeys(translations, allKeys);
      
      results[locale] = {
        missing: missing.length,
        total: allKeys.size
      };
      
      // Adiciona chaves em falta
      const updated = { ...translations };
      
      for (const key of missing) {
        // Para inglês, usa placeholder; para português, usa a chave
        const placeholder = locale === 'en' ? `[${key}]` : key;
        this.setNestedValue(updated, key, placeholder);
      }
      
      // Remove chaves órfãs e reorganiza
      const cleaned = this.removeOrphanKeys(updated, allKeys);
      
      // Salva arquivo atualizado
      if (this.saveTranslations(locale, cleaned)) {
        if (missing.length > 0) {
          console.log(`✅ ${locale}.json: ${missing.length} chaves adicionadas`);
        } else {
          console.log(`✅ ${locale}.json: já sincronizado`);
        }
      }
    }
    
    // Relatório final
    console.log('\n📊 Relatório de Sincronização:');
    for (const [locale, result] of Object.entries(results)) {
      const percentage = ((result.total - result.missing) / result.total * 100).toFixed(1);
      console.log(`  ${locale}: ${result.total - result.missing}/${result.total} (${percentage}%)`);
    }
    
    console.log('🎉 Sincronização concluída!');
    
    return results;
  }

  /**
   * Valida integridade das traduções
   */
  validate() {
    console.log('🔍 Validando integridade das traduções...');
    
    const issues = [];
    const allTranslations = {};
    
    // Carrega todas as traduções
    for (const locale of this.supportedLocales) {
      allTranslations[locale] = this.loadTranslations(locale);
    }
    
    // Extrai todas as chaves únicas
    const allKeys = new Set();
    for (const translations of Object.values(allTranslations)) {
      const keys = this.extractAllKeys(translations);
      keys.forEach(key => allKeys.add(key));
    }
    
    // Verifica cada idioma
    for (const locale of this.supportedLocales) {
      const translations = allTranslations[locale];
      
      for (const key of allKeys) {
        const value = this.getNestedValue(translations, key);
        
        if (value === undefined) {
          issues.push({
            type: 'missing',
            locale,
            key,
            message: `Chave '${key}' em falta em ${locale}`
          });
        } else if (typeof value === 'string') {
          // Verifica placeholders não traduzidos
          if (locale === 'en' && value.startsWith('[') && value.endsWith(']')) {
            issues.push({
              type: 'placeholder',
              locale,
              key,
              message: `Placeholder não traduzido: '${value}'`
            });
          }
          
          // Verifica strings vazias
          if (value.trim() === '') {
            issues.push({
              type: 'empty',
              locale,
              key,
              message: `Tradução vazia para '${key}'`
            });
          }
        }
      }
    }
    
    // Relatório de validação
    if (issues.length === 0) {
      console.log('✅ Todas as traduções estão válidas!');
    } else {
      console.log(`⚠️  Encontrados ${issues.length} problemas:`);
      
      const groupedIssues = {};
      issues.forEach(issue => {
        if (!groupedIssues[issue.type]) {
          groupedIssues[issue.type] = [];
        }
        groupedIssues[issue.type].push(issue);
      });
      
      for (const [type, typeIssues] of Object.entries(groupedIssues)) {
        console.log(`\n${type.toUpperCase()}:`);
        typeIssues.forEach(issue => {
          console.log(`  - ${issue.message}`);
        });
      }
    }
    
    return issues;
  }
}

// Executa o script se chamado diretamente
if (require.main === module) {
  const syncer = new TranslationSyncer();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'validate':
      syncer.validate();
      break;
    case 'sync':
    default:
      syncer.sync();
      break;
  }
}

module.exports = TranslationSyncer;