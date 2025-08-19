#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script para extrair chaves de tradução automaticamente do código
 * Procura por padrões t('chave') e t("chave") nos arquivos JSX/JS
 */

class TranslationExtractor {
  constructor() {
    this.translationKeys = new Set();
    this.sourceDir = path.join(__dirname, '../src');
    this.localesDir = path.join(__dirname, '../src/locales');
  }

  /**
   * Extrai chaves de tradução de um arquivo
   */
  extractFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Regex para encontrar padrões t('chave') ou t("chave")
      const regex = /t\(['"`]([^'"`,)]+)['"`]\)/g;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        if (key && !key.includes('${')) { // Ignora template literals
          this.translationKeys.add(key);
        }
      }
    } catch (error) {
      console.error(`Erro ao processar arquivo ${filePath}:`, error.message);
    }
  }

  /**
   * Procura por todos os arquivos JS/JSX no diretório src
   */
  findSourceFiles() {
    const pattern = path.join(this.sourceDir, '**/*.{js,jsx}').replace(/\\/g, '/');
    return glob.sync(pattern, {
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/locales/**'
      ]
    });
  }

  /**
   * Carrega arquivo de tradução existente
   */
  loadExistingTranslations(locale) {
    const filePath = path.join(this.localesDir, `${locale}.json`);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error(`Erro ao carregar traduções de ${locale}:`, error.message);
    }
    return {};
  }

  /**
   * Cria estrutura aninhada a partir de uma chave com pontos
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
    if (!(lastKey in current)) {
      current[lastKey] = value;
    }
  }

  /**
   * Atualiza arquivo de tradução com novas chaves
   */
  updateTranslationFile(locale, isTemplate = false) {
    const existing = this.loadExistingTranslations(locale);
    const updated = { ...existing };
    let newKeysCount = 0;

    // Adiciona novas chaves encontradas
    for (const key of this.translationKeys) {
      if (!this.hasNestedKey(existing, key)) {
        const value = isTemplate ? `[${key}]` : key;
        this.setNestedValue(updated, key, value);
        newKeysCount++;
      }
    }

    // Salva arquivo atualizado
    const filePath = path.join(this.localesDir, `${locale}.json`);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
    
    return newKeysCount;
  }

  /**
   * Verifica se uma chave aninhada existe no objeto
   */
  hasNestedKey(obj, key) {
    const keys = key.split('.');
    let current = obj;
    
    for (const k of keys) {
      if (!current || typeof current !== 'object' || !(k in current)) {
        return false;
      }
      current = current[k];
    }
    
    return true;
  }

  /**
   * Executa a extração completa
   */
  run() {
    console.log('🔍 Extraindo chaves de tradução...');
    
    // Encontra todos os arquivos fonte
    const sourceFiles = this.findSourceFiles();
    console.log(`📁 Encontrados ${sourceFiles.length} arquivos para análise`);
    
    // Extrai chaves de cada arquivo
    sourceFiles.forEach(file => {
      this.extractFromFile(file);
    });
    
    console.log(`🔑 Encontradas ${this.translationKeys.size} chaves de tradução`);
    
    if (this.translationKeys.size === 0) {
      console.log('ℹ️  Nenhuma nova chave encontrada.');
      return;
    }
    
    // Garante que o diretório de locales existe
    if (!fs.existsSync(this.localesDir)) {
      fs.mkdirSync(this.localesDir, { recursive: true });
    }
    
    // Atualiza arquivos de tradução
    const locales = ['pt', 'en'];
    
    locales.forEach(locale => {
      const newKeys = this.updateTranslationFile(locale, locale === 'en');
      if (newKeys > 0) {
        console.log(`✅ ${locale}.json: ${newKeys} novas chaves adicionadas`);
      } else {
        console.log(`✅ ${locale}.json: atualizado (sem novas chaves)`);
      }
    });
    
    console.log('🎉 Extração concluída!');
    
    // Lista as chaves encontradas
    if (process.argv.includes('--verbose')) {
      console.log('\n📋 Chaves encontradas:');
      Array.from(this.translationKeys).sort().forEach(key => {
        console.log(`  - ${key}`);
      });
    }
  }
}

// Executa o script se chamado diretamente
if (require.main === module) {
  const extractor = new TranslationExtractor();
  extractor.run();
}

module.exports = TranslationExtractor;