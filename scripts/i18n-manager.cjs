#!/usr/bin/env node

const TranslationExtractor = require('./extract-translations.cjs');
const TranslationSyncer = require('./sync-translations.cjs');
const TranslationValidator = require('./validate-translations.cjs');

/**
 * Script principal para gerenciar traduções
 * Integra extração, sincronização e validação
 */

class I18nManager {
  constructor() {
    this.extractor = new TranslationExtractor();
    this.syncer = new TranslationSyncer();
    this.validator = new TranslationValidator();
  }

  /**
   * Mostra ajuda
   */
  showHelp() {
    console.log(`
🌍 Gerenciador de Traduções AWAYSUK
`);
    console.log('Comandos disponíveis:');
    console.log('  extract     - Extrai chaves de tradução do código');
    console.log('  sync        - Sincroniza traduções entre idiomas');
    console.log('  validate    - Valida integridade das traduções');
    console.log('  quick       - Validação rápida (sem análise de uso)');
    console.log('  update      - Extrai + Sincroniza + Valida');
    console.log('  build-check - Verificação para build (falha se houver erros)');
    console.log('  stats       - Mostra estatísticas das traduções');
    console.log('  help        - Mostra esta ajuda');
    console.log('\nOpções:');
    console.log('  --verbose   - Saída detalhada');
    console.log('  --quiet     - Saída mínima');
    console.log('\nExemplos:');
    console.log('  npm run i18n extract');
    console.log('  npm run i18n update --verbose');
    console.log('  npm run i18n build-check');
  }

  /**
   * Extrai chaves de tradução
   */
  extract() {
    console.log('🔄 Extraindo chaves de tradução...');
    this.extractor.run();
  }

  /**
   * Sincroniza traduções
   */
  sync() {
    console.log('🔄 Sincronizando traduções...');
    return this.syncer.sync();
  }

  /**
   * Valida traduções
   */
  validate() {
    console.log('🔄 Validando traduções...');
    this.validator.validate();
  }

  /**
   * Validação rápida
   */
  quickValidate() {
    console.log('🔄 Validação rápida...');
    return this.validator.quickValidate();
  }

  /**
   * Atualização completa (extrai + sincroniza + valida)
   */
  update() {
    console.log('🔄 Iniciando atualização completa das traduções...');
    
    try {
      // 1. Extrai novas chaves
      console.log('\n📝 Passo 1: Extraindo chaves...');
      this.extractor.run();
      
      // 2. Sincroniza entre idiomas
      console.log('\n🔄 Passo 2: Sincronizando...');
      this.syncer.sync();
      
      // 3. Valida resultado
      console.log('\n✅ Passo 3: Validando...');
      const isValid = this.validator.quickValidate();
      
      if (isValid) {
        console.log('\n🎉 Atualização completa realizada com sucesso!');
      } else {
        console.log('\n⚠️ Atualização concluída, mas há problemas a resolver.');
      }
      
    } catch (error) {
      console.error('❌ Erro durante a atualização:', error.message);
      process.exit(1);
    }
  }

  /**
   * Verificação para build (falha se houver erros críticos)
   */
  buildCheck() {
    console.log('🔍 Verificação para build...');
    
    try {
      this.validator.issues = [];
      this.validator.validateFormat();
      this.validator.validateStructure();
      
      const errors = this.validator.issues.filter(issue => issue.severity === 'error');
      
      if (errors.length > 0) {
        console.log(`❌ Build falhou: ${errors.length} erros encontrados`);
        errors.forEach(error => {
          console.log(`  - ${error.message}`);
        });
        process.exit(1);
      } else {
        console.log('✅ Verificação de build passou!');
      }
      
    } catch (error) {
      console.error('❌ Erro na verificação de build:', error.message);
      process.exit(1);
    }
  }

  /**
   * Mostra estatísticas das traduções
   */
  showStats() {
    console.log('📊 Estatísticas das Traduções\n');
    
    try {
      const results = this.syncer.sync();
      const usedKeys = this.validator.findUsedKeys();
      
      console.log('\n📈 Resumo:');
      
      for (const [locale, result] of Object.entries(results)) {
        const percentage = ((result.total - result.missing) / result.total * 100).toFixed(1);
        const status = result.missing === 0 ? '✅' : '⚠️';
        console.log(`  ${status} ${locale.toUpperCase()}: ${result.total - result.missing}/${result.total} (${percentage}%)`);
      }
      
      console.log(`\n🔑 Chaves usadas no código: ${usedKeys.size}`);
      console.log(`🔑 Total de chaves definidas: ${Object.values(results)[0]?.total || 0}`);
      
      // Calcula cobertura geral
      const totalKeys = Object.values(results)[0]?.total || 0;
      const avgCompletion = Object.values(results).reduce((sum, result) => {
        return sum + ((result.total - result.missing) / result.total);
      }, 0) / Object.keys(results).length;
      
      console.log(`\n🎯 Cobertura média: ${(avgCompletion * 100).toFixed(1)}%`);
      
      if (avgCompletion === 1) {
        console.log('🎉 Todas as traduções estão completas!');
      } else if (avgCompletion > 0.9) {
        console.log('👍 Traduções quase completas!');
      } else if (avgCompletion > 0.7) {
        console.log('⚠️ Algumas traduções em falta.');
      } else {
        console.log('❌ Muitas traduções em falta.');
      }
      
    } catch (error) {
      console.error('❌ Erro ao gerar estatísticas:', error.message);
    }
  }

  /**
   * Executa comando baseado nos argumentos
   */
  run() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    
    // Configura verbosidade
    const isVerbose = args.includes('--verbose');
    const isQuiet = args.includes('--quiet');
    
    if (isQuiet) {
      // Suprime logs desnecessários
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        if (message.includes('✅') || message.includes('❌') || message.includes('🎉')) {
          originalLog(...args);
        }
      };
    }
    
    switch (command) {
      case 'extract':
        this.extract();
        break;
        
      case 'sync':
        this.sync();
        break;
        
      case 'validate':
        this.validate();
        break;
        
      case 'quick':
        this.quickValidate();
        break;
        
      case 'update':
        this.update();
        break;
        
      case 'build-check':
        this.buildCheck();
        break;
        
      case 'stats':
        this.showStats();
        break;
        
      case 'help':
      default:
        this.showHelp();
        break;
    }
  }
}

// Executa o script se chamado diretamente
if (require.main === module) {
  const manager = new I18nManager();
  manager.run();
}

module.exports = I18nManager;