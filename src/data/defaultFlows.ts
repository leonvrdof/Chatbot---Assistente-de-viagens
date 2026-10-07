import { FlowDefinition } from '../types/chat';

export const TRAVEL_FLOW: FlowDefinition = {
  id: 'assistente_viagens',
  name: 'Assistente de Viagens (Lia)',
  description: 'Fluxo oficial estruturado no Figma: Onboarding, Aceite de Política, Cadastro, Destinos, Datas, Resumo, Transporte, Hospedagem e Passeios.',
  botProfile: {
    name: 'Lia | Assistente de Viagens',
    verified: true,
    subtitle: 'Conta comercial verificada',
    avatarColor: '#00A884',
    avatarText: 'LV',
    avatarUrl: '/src/assets/images/travel_assistant_avatar_1791250468241.jpg',
    phone: '+55 11 98765-4321',
    category: 'Agência de Turismo & Viagens',
  },
  startNodeId: 'node_onboarding_welcome',
  nodes: {
    // ----------------------------------------------------
    // 1. ONBOARDING
    // ----------------------------------------------------
    node_onboarding_welcome: {
      id: 'node_onboarding_welcome',
      title: '01. Onboarding — Primeiro Contato',
      category: '1. Onboarding',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'Olá! Eu sou a Lia, sua assistente de viagens.\n\nVou te ajudar em cada etapa do planejamento, do destino até a volta para casa. 🌍',
        },
        {
          type: 'document',
          mediaTitle: 'Politica_de_Privacidade.pdf',
          mediaSubtitle: 'Documento Oficial · 185 KB',
          fileSize: '185 KB',
        },
        {
          type: 'text',
          text: 'Seus dados estão protegidos. 🔒\n\nVocê aceita a Política de Privacidade?',
        },
      ],
      interactiveType: 'quick_replies',
      fallbackMessage: 'Preciso que escolha entre Sim ou Não para continuar.\n\nPode selecionar uma das opções abaixo?',
      options: [
        {
          id: 'opt_priv_sim',
          title: 'Sim',
          nextNodeId: 'node_onboarding_aceita',
          keywords: ['sim', 'aceito', 'concordo', '1'],
        },
        {
          id: 'opt_priv_nao',
          title: 'Não',
          nextNodeId: 'node_onboarding_pedir_novamente',
          keywords: ['nao', 'não', 'recuso', '2'],
        },
      ],
    },

    node_onboarding_pedir_novamente: {
      id: 'node_onboarding_pedir_novamente',
      title: '01B. Onboarding — Pedir Aceite Novamente',
      category: '1. Onboarding',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Antes de continuarmos, preciso do seu aceite da Política de Privacidade, ela explica como usamos suas informações durante o atendimento.',
        },
        {
          type: 'document',
          mediaTitle: 'Politica_de_Privacidade.pdf',
          mediaSubtitle: 'Documento Oficial · 185 KB',
          fileSize: '185 KB',
        },
        {
          type: 'text',
          text: 'Você aceita nossa Política de Privacidade?',
        },
      ],
      interactiveType: 'quick_replies',
      fallbackMessage: 'Preciso que escolha entre Sim ou Não para continuar.\n\nPode selecionar uma das opções abaixo?',
      options: [
        {
          id: 'opt_re_sim',
          title: 'Sim',
          nextNodeId: 'node_onboarding_aceita',
          keywords: ['sim', 'aceito', 'concordo'],
        },
        {
          id: 'opt_re_nao',
          title: 'Não',
          nextNodeId: 'node_onboarding_pedir_novamente',
          keywords: ['nao', 'não', 'recuso'],
        },
      ],
    },

    node_onboarding_aceita: {
      id: 'node_onboarding_aceita',
      title: '01C. Onboarding — Política Aceita',
      category: '1. Onboarding',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'A Política de Privacidade foi aceita.\n\nAgora vou verificar se você já possui cadastro.',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_avancar_cadastro',
          title: 'Continuar para validação',
          nextNodeId: 'node_cadastro_pedir_telefone',
        },
      ],
    },

    // ----------------------------------------------------
    // 2. CADASTRO
    // ----------------------------------------------------
    node_cadastro_pedir_telefone: {
      id: 'node_cadastro_pedir_telefone',
      title: '02. Cadastro — Pedir Telefone',
      category: '2. Cadastro',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Preciso que informe seu *telefone com DDD*.\n\nDigite *apenas os números, sem espaços, pontos ou traços*.\n\n_Exemplo:_ _11992483496_',
        },
      ],
      interactiveType: 'text_input',
      inputPlaceholder: 'Ex: 11992483496',
      inputType: 'number',
      fallbackMessage: 'Não consegui reconhecer esse número.\n\nPode enviar novamente, apenas com os números e o DDD?\n\n_Exemplo:_ _11992483496_',
      options: [
        {
          id: 'opt_tel_enviar',
          title: 'Verificar telefone',
          nextNodeId: 'node_cadastro_verificando',
        },
      ],
    },

    node_cadastro_verificando: {
      id: 'node_cadastro_verificando',
      title: '02B. Cadastro — Verificando',
      category: '2. Cadastro',
      delayMs: 700,
      messages: [
        {
          type: 'text',
          text: 'Estou verificando se você já tem um cadastro com esse telefone. Isso leva só alguns segundos.',
        },
        {
          type: 'text',
          text: 'Não encontrei um cadastro com este telefone. Como deseja continuar?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_cad_corrigir_tel',
          title: 'Corrigir telefone',
          nextNodeId: 'node_cadastro_pedir_telefone',
          keywords: ['corrigir', 'telefone', 'número', '1'],
        },
        {
          id: 'opt_cad_criar_novo',
          title: 'Criar novo cadastro',
          nextNodeId: 'node_cadastro_criar_novo',
          keywords: ['criar', 'novo', 'cadastro', '2'],
        },
      ],
    },

    node_cadastro_reconhecido: {
      id: 'node_cadastro_reconhecido',
      title: '02C. Cadastro — Usuário Reconhecido',
      category: '2. Cadastro',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'Que bom ter você de volta, {{nome_usuario}}! 😊',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_rec_avancar',
          title: 'Definir meu destino',
          nextNodeId: 'node_definir_destino',
          keywords: ['avançar', 'destino', 'definir', '1'],
        },
      ],
    },

    node_cadastro_criar_novo: {
      id: 'node_cadastro_criar_novo',
      title: '02D. Cadastro — Criar Novo Cadastro',
      category: '2. Cadastro',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Para criar o cadastro, preciso que informe seu *telefone com DDD*.\n\nDigite *apenas os números, sem espaços, pontos ou traços*.\n\n_Exemplo:_ _11992483496_',
        },
      ],
      interactiveType: 'text_input',
      inputPlaceholder: 'Digite seu telefone com DDD...',
      inputType: 'number',
      fallbackMessage: 'Não consegui reconhecer esse número.\n\nPode enviar novamente, apenas com os números e o DDD?\n\n_Exemplo:_ _11992483496_',
      options: [
        {
          id: 'opt_cad_salvar',
          title: 'Salvar cadastro',
          nextNodeId: 'node_cadastro_criado',
        },
      ],
    },

    node_cadastro_criado: {
      id: 'node_cadastro_criado',
      title: '02E. Cadastro — Cadastro Criado',
      category: '2. Cadastro',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'Prontinho! Seu cadastro foi criado com sucesso. 😊',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_cad_feito_avancar',
          title: 'Definir meu destino',
          nextNodeId: 'node_definir_destino',
        },
      ],
    },

    // ----------------------------------------------------
    // 3. DEFINIR DESTINO (PRIMEIRA PERGUNTA)
    // ----------------------------------------------------
    node_definir_destino: {
      id: 'node_definir_destino',
      title: '03. Definir Destino',
      category: '3. Definir Destino',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Agora me conta: você já tem um destino em mente ou prefere que eu sugira algumas opções?',
        },
      ],
      interactiveType: 'quick_replies',
      fallbackMessage: 'Não consegui entender sua resposta.\n\nPode me dizer se já tem um destino em mente ou se prefere sugestões?',
      options: [
        {
          id: 'opt_tenho_destino',
          title: 'Tenho um destino',
          nextNodeId: 'node_destino_definido',
          keywords: ['tenho', 'já tenho', 'destino em mente', '1'],
        },
        {
          id: 'opt_quero_sugestoes',
          title: 'Quero saber sugestões',
          nextNodeId: 'node_sugestoes_calor_frio',
          keywords: ['sugestoes', 'sugestões', 'sugerir', '2'],
        },
      ],
    },

    // ----------------------------------------------------
    // 4. DESTINO DEFINIDO (COLETA ESPECÍFICA)
    // ----------------------------------------------------
    node_destino_definido: {
      id: 'node_destino_definido',
      title: '04. Destino Definido',
      category: '4. Destino Definido',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'Para onde você quer viajar?',
        },
      ],
      interactiveType: 'text_input',
      inputPlaceholder: 'Ex: Porto de Galinhas, Gramado, Paris...',
      inputType: 'text',
      variableToSave: 'destino',
      fallbackMessage: 'Não consegui entender para onde deseja viajar. Como deseja continuar?',
      options: [
        {
          id: 'opt_dest_especifico_ok',
          title: 'Confirmar destino',
          nextNodeId: 'node_sobre_viagem_abertura',
        },
      ],
    },

    node_destino_erro: {
      id: 'node_destino_erro',
      title: '04B. Destino — Erro de Entendimento',
      category: '4. Destino Definido',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'Não consegui entender para onde deseja viajar. Como deseja continuar?',
        },
      ],
      interactiveType: 'quick_replies',
      fallbackMessage: 'Não consegui entender para onde deseja viajar. Como deseja continuar?',
      options: [
        {
          id: 'opt_erro_novo_destino',
          title: 'Definir novo destino',
          nextNodeId: 'node_destino_definido',
          keywords: ['novo destino', 'definir', 'outro destino', 'tentar', '1'],
        },
        {
          id: 'opt_erro_sugestoes',
          title: 'Quero saber sugestões',
          nextNodeId: 'node_sugestoes_calor_frio',
          keywords: ['sugestoes', 'sugestões', 'quero sugestões', '2'],
        },
      ],
    },

    // ----------------------------------------------------
    // 5. SUGESTÕES DE DESTINO
    // ----------------------------------------------------
    node_sugestoes_calor_frio: {
      id: 'node_sugestoes_calor_frio',
      title: '05A. Sugestões — Calor / Frio',
      category: '5. Sugestões de Destino',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Me conta um pouco do que você procura nessa viagem, assim consigo sugerir os destinos certos.\n\nVocê prefere um lugar mais quente ou mais frio?',
        },
        {
          type: 'text',
          text: 'Prefere mais calor ou mais frio?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_clima_calor',
          title: 'Calor',
          nextNodeId: 'node_sugestoes_estilo',
          keywords: ['calor', 'quente', 'verao', '1'],
        },
        {
          id: 'opt_clima_frio',
          title: 'Frio',
          nextNodeId: 'node_sugestoes_estilo',
          keywords: ['frio', 'inverno', 'neve', '2'],
        },
        {
          id: 'opt_clima_tanto_faz',
          title: 'Tanto faz',
          nextNodeId: 'node_sugestoes_estilo',
          keywords: ['tanto faz', 'qualquer', 'indiferente', '3'],
        },
      ],
    },

    node_sugestoes_estilo: {
      id: 'node_sugestoes_estilo',
      title: '05B. Sugestões — Estilo de Destino',
      category: '5. Sugestões de Destino',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'E o que mais combina com você: praia, natureza ou cidade histórica? Se preferir algo diferente, como compras, é só me contar.',
        },
        {
          type: 'text',
          text: 'Selecione uma das opções:',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_est_praia',
          title: 'Praia',
          nextNodeId: 'node_sugestoes_nacional_internacional',
          keywords: ['praia', 'mar', 'litoral', '1'],
        },
        {
          id: 'opt_est_natureza',
          title: 'Natureza',
          nextNodeId: 'node_sugestoes_nacional_internacional',
          keywords: ['natureza', 'campo', 'serra', '2'],
        },
        {
          id: 'opt_est_historica',
          title: 'Cidade histórica',
          nextNodeId: 'node_sugestoes_nacional_internacional',
          keywords: ['cidade historica', 'historica', 'cultural', '3'],
        },
      ],
    },

    node_sugestoes_nacional_internacional: {
      id: 'node_sugestoes_nacional_internacional',
      title: '05C. Sugestões — Nacional / Internacional',
      category: '5. Sugestões de Destino',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Por último, tem preferência por viagem nacional ou internacional?',
        },
        {
          type: 'text',
          text: 'Nacional ou internacional?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_escopo_nacional',
          title: 'Nacional',
          nextNodeId: 'node_sugestoes_apresentacao',
          keywords: ['nacional', 'brasil', '1'],
        },
        {
          id: 'opt_escopo_internacional',
          title: 'Internacional',
          nextNodeId: 'node_sugestoes_apresentacao',
          keywords: ['internacional', 'exterior', 'fora', '2'],
        },
      ],
    },

    node_sugestoes_apresentacao: {
      id: 'node_sugestoes_apresentacao',
      title: '05D. Sugestões — Apresentação e Escolha',
      category: '5. Sugestões de Destino',
      delayMs: 700,
      messages: [
        {
          type: 'text',
          text: 'Com base no que você me contou, separei algumas sugestões de destino:\n\n*1. {{destino 1}}*\n*2. {{destino 2}}*',
        },
        {
          type: 'text',
          text: 'Qual você prefere?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_sug_dest_1',
          title: '1. {{destino 1}}',
          nextNodeId: 'node_sobre_viagem_abertura',
          keywords: ['1', 'primeira', 'primeiro', 'destino 1'],
        },
        {
          id: 'opt_sug_dest_2',
          title: '2. {{destino 2}}',
          nextNodeId: 'node_sobre_viagem_abertura',
          keywords: ['2', 'segunda', 'segundo', 'destino 2'],
        },
        {
          id: 'opt_sug_outras',
          title: '3. Quero outras sugestões',
          nextNodeId: 'node_sugestoes_apresentacao',
          keywords: ['3', 'outras', 'mais', 'outras sugestões', 'quero outras sugestões'],
        },
      ],
    },

    // ----------------------------------------------------
    // 6. SOBRE A VIAGEM (DATAS E PESSOAS)
    // ----------------------------------------------------
    node_sobre_viagem_abertura: {
      id: 'node_sobre_viagem_abertura',
      title: '06A. Sobre a Viagem — Datas',
      category: '6. Sobre a Viagem',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Perfeito! Agora, para fechar os detalhes da sua viagem para {{destino}}, preciso de duas informações.',
        },
        {
          type: 'text',
          text: 'Em qual data você pretende viajar? Digite as datas de ida e volta no formato dd/mm/aaaa.\n\n_Exemplo:_ _12/11/2026 a 20/11/2026_',
        },
      ],
      interactiveType: 'text_input',
      inputPlaceholder: 'Ex: 12/11/2026 a 20/11/2026',
      inputType: 'text',
      fallbackMessage: 'Não consegui identificar as duas datas (ida e volta).\n\nPode enviar novamente no formato dd/mm/aaaa a dd/mm/aaaa?\n\n_Exemplo:_ _12/11/2026 a 20/11/2026_',
      options: [
        {
          id: 'opt_datas_ok',
          title: 'Avançar para quantidade de pessoas',
          nextNodeId: 'node_sobre_viagem_pessoas',
        },
      ],
    },

    node_sobre_viagem_pessoas: {
      id: 'node_sobre_viagem_pessoas',
      title: '06B. Sobre a Viagem — Quantidade de Pessoas',
      category: '6. Sobre a Viagem',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Quantas pessoas irão viajar? Para organizar direitinho, inclua você na contagem.\n\n_Exemplo:_ se você e mais 3 pessoas forem viajar, digite: 4 pessoas.',
        },
      ],
      interactiveType: 'text_input',
      inputPlaceholder: 'Ex: 4 pessoas',
      inputType: 'text',
      variableToSave: 'quantidade_pessoas',
      fallbackMessage: 'Não consegui entender a quantidade de pessoas.\n\nPode me enviar apenas o número? Inclua você na contagem.\n\n_Exemplo:_ _4 pessoas_',
      options: [
        {
          id: 'opt_pessoas_ok',
          title: 'Ver resumo da viagem',
          nextNodeId: 'node_confirmacao_resumo',
        },
      ],
    },

    // ----------------------------------------------------
    // 7. CONFIRMAÇÃO (RESUMO)
    // ----------------------------------------------------
    node_confirmacao_resumo: {
      id: 'node_confirmacao_resumo',
      title: '07. Confirmação (Resumo)',
      category: '7. Confirmação (Resumo)',
      delayMs: 700,
      messages: [
        {
          type: 'text',
          text: 'Só confirmando antes de seguir:\n\nViagem para *{{destino}}*, de *{{data_ida}}* a *{{data_volta}}*, para *{{quantidade_pessoas}} pessoas*.\n\nEstá tudo certo?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_resumo_certo',
          title: 'Sim, está tudo certo',
          nextNodeId: 'node_como_vai_viajar',
          keywords: ['sim', 'certo', 'correto', '1'],
        },
        {
          id: 'opt_resumo_corrigir',
          title: 'Corrigir informações',
          nextNodeId: 'node_o_que_corrigir',
          keywords: ['corrigir', 'alterar', 'mudar', '2'],
        },
      ],
    },

    node_o_que_corrigir: {
      id: 'node_o_que_corrigir',
      title: '07B. O Que Corrigir',
      category: '7. Confirmação (Resumo)',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'O que você quer corrigir?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_corr_destino',
          title: 'Destino',
          nextNodeId: 'node_definir_destino',
          keywords: ['destino', '1'],
        },
        {
          id: 'opt_corr_datas_pessoas',
          title: 'Datas ou quantidade de pessoas',
          nextNodeId: 'node_sobre_viagem_abertura',
          keywords: ['datas', 'pessoas', '2'],
        },
      ],
    },

    // ----------------------------------------------------
    // 8. COMO VAI VIAJAR
    // ----------------------------------------------------
    node_como_vai_viajar: {
      id: 'node_como_vai_viajar',
      title: '08. Como Vai Viajar',
      category: '8. Como Vai Viajar',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'De que maneira você pretende viajar até {{destino}}?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_transp_aviao',
          title: 'Avião',
          nextNodeId: 'node_passagem_aerea',
          keywords: ['aviao', 'avião', 'voo', '1'],
        },
        {
          id: 'opt_transp_onibus',
          title: 'Ônibus',
          nextNodeId: 'node_passagem_onibus',
          keywords: ['onibus', 'ônibus', 'rodoviaria', '2'],
        },
        {
          id: 'opt_transp_particular',
          title: 'De forma particular',
          nextNodeId: 'node_hospedagem_abertura',
          keywords: ['particular', 'carro', 'proprio', '3'],
        },
      ],
    },

    // ----------------------------------------------------
    // 9. PASSAGEM AÉREA
    // ----------------------------------------------------
    node_passagem_aerea: {
      id: 'node_passagem_aerea',
      title: '09. Passagem Aérea',
      category: '9. Passagem Aérea',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Você escolheu viajar de avião para {{destino}}.\n\nPara consultar horários e valores, acesse: www.exemplo-passagens.com.br',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_ir_para_hospedagem',
          title: 'Ver Hospedagem em {{destino}}',
          nextNodeId: 'node_hospedagem_abertura',
        },
      ],
    },

    // ----------------------------------------------------
    // 10. PASSAGEM DE ÔNIBUS
    // ----------------------------------------------------
    node_passagem_onibus: {
      id: 'node_passagem_onibus',
      title: '10. Passagem de Ônibus',
      category: '10. Passagem de Ônibus',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Você escolheu viajar de ônibus para {{destino}}.\n\nPara consultar horários e valores, acesse: www.exemplo-passagens.com.br',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_ir_para_hospedagem_bus',
          title: 'Ver Hospedagem em {{destino}}',
          nextNodeId: 'node_hospedagem_abertura',
        },
      ],
    },

    // ----------------------------------------------------
    // 11. HOSPEDAGEM
    // ----------------------------------------------------
    node_hospedagem_abertura: {
      id: 'node_hospedagem_abertura',
      title: '11A. Hospedagem — Preferência de Localização',
      category: '11. Hospedagem',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Vou te ajudar a encontrar uma hospedagem boa para {{destino}}. Você prefere ficar mais perto da praia, do centro, ou sem preferência?',
        },
        {
          type: 'text',
          text: 'Onde você prefere se hospedar?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_hosp_praia',
          title: 'Perto da praia',
          nextNodeId: 'node_hospedagem_apresentacao',
          keywords: ['praia', 'beira mar', '1'],
        },
        {
          id: 'opt_hosp_centro',
          title: 'No centro',
          nextNodeId: 'node_hospedagem_apresentacao',
          keywords: ['centro', 'cidade', '2'],
        },
        {
          id: 'opt_hosp_sem_pref',
          title: 'Sem preferência',
          nextNodeId: 'node_hospedagem_apresentacao',
          keywords: ['sem preferencia', 'tanto faz', '3'],
        },
      ],
    },

    node_hospedagem_apresentacao: {
      id: 'node_hospedagem_apresentacao',
      title: '11B. Hospedagem — Apresentação e Escolha',
      category: '11. Hospedagem',
      delayMs: 700,
      messages: [
        {
          type: 'text',
          text: 'Com base nas suas preferências, separei duas sugestões de hospedagem para você:\n\n{{hospedagem 1}}\n{{hospedagem 2}}',
        },
        {
          type: 'text',
          text: 'Escolha uma opção:',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_hosp_1',
          title: '{{hospedagem 1}}',
          nextNodeId: 'node_hospedagem_confirma_1',
          keywords: ['1', 'hospedagem 1'],
        },
        {
          id: 'opt_hosp_2',
          title: '{{hospedagem 2}}',
          nextNodeId: 'node_hospedagem_confirma_2',
          keywords: ['2', 'hospedagem 2'],
        },
        {
          id: 'opt_hosp_outras',
          title: 'Quero outras sugestões',
          nextNodeId: 'node_hospedagem_abertura',
          keywords: ['outras', 'mais', '3'],
        },
      ],
    },

    node_hospedagem_confirma_1: {
      id: 'node_hospedagem_confirma_1',
      title: '11C. Hospedagem — Confirmação (Opção 1)',
      category: '11. Hospedagem',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Prontinho! A {{hospedagem 1}} em {{destino}} está confirmada.',
        },
        {
          type: 'text',
          text: 'Quer que eu te mostre também dicas e passeios em {{destino}}?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_dicas_sim_1',
          title: 'Sim, quero ver',
          nextNodeId: 'node_dicas_apresentacao',
          keywords: ['sim', 'quero ver', '1'],
        },
        {
          id: 'opt_dicas_nao_1',
          title: 'Não, obrigado',
          nextNodeId: 'node_finalizacao_pergunta',
          keywords: ['nao', 'não', 'obrigado', '2'],
        },
      ],
    },

    node_hospedagem_confirma_2: {
      id: 'node_hospedagem_confirma_2',
      title: '11D. Hospedagem — Confirmação (Opção 2)',
      category: '11. Hospedagem',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Prontinho! A {{hospedagem 2}} em {{destino}} está confirmada.',
        },
        {
          type: 'text',
          text: 'Quer que eu te mostre também dicas e passeios em {{destino}}?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_dicas_sim_2',
          title: 'Sim, quero ver',
          nextNodeId: 'node_dicas_apresentacao',
          keywords: ['sim', 'quero ver', '1'],
        },
        {
          id: 'opt_dicas_nao_2',
          title: 'Não, obrigado',
          nextNodeId: 'node_finalizacao_pergunta',
          keywords: ['nao', 'não', 'obrigado', '2'],
        },
      ],
    },

    // ----------------------------------------------------
    // 12. DICAS DO DESTINO
    // ----------------------------------------------------
    node_dicas_apresentacao: {
      id: 'node_dicas_apresentacao',
      title: '12. Dicas do Destino — Apresentação dos Passeios',
      category: '12. Dicas do Destino',
      delayMs: 700,
      messages: [
        {
          type: 'text',
          text: 'Agora que já sabemos para onde você vai e onde irá se hospedar, separei alguns passeios com guia em {{destino}}.',
        },
        {
          type: 'text',
          text: 'Qual passeio você quer conhecer?',
        },
      ],
      interactiveType: 'quick_replies',
      fallbackMessage: 'Não consegui entender sua resposta.\n\nVocê pode escolher uma das opções acima ou pedir novas sugestões.',
      options: [
        {
          id: 'opt_passeio_1',
          title: '{{passeio 1}}',
          nextNodeId: 'node_dicas_confirmacao',
          keywords: ['1', 'passeio 1', 'primeiro'],
        },
        {
          id: 'opt_passeio_2',
          title: '{{passeio 2}}',
          nextNodeId: 'node_dicas_confirmacao',
          keywords: ['2', 'passeio 2', 'segundo'],
        },
        {
          id: 'opt_passeio_outras',
          title: 'Quero outras sugestões',
          nextNodeId: 'node_dicas_confirmacao',
          keywords: ['outras', 'mais', '3'],
        },
      ],
    },

    node_dicas_confirmacao: {
      id: 'node_dicas_confirmacao',
      title: '12B. Dicas do Destino — Confirmação e Contato',
      category: '12. Dicas do Destino',
      delayMs: 650,
      messages: [
        {
          type: 'text',
          text: 'Você escolheu o passeio com guia em {{destino}} (*{{passeio_escolhido}}*).\n\nPara confirmar e agendar, entre em contato pelo WhatsApp: (XX) XXXXX-XXXX.',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_fim_algo_mais',
          title: 'Quero algo a mais',
          nextNodeId: 'node_finalizacao_pergunta',
          keywords: ['algo a mais', 'algo mais', '1'],
        },
        {
          id: 'opt_fim_concluir',
          title: 'Finalizar atendimento',
          nextNodeId: 'node_fim_atendimento',
          keywords: ['finalizar', 'concluir', '2'],
        },
      ],
    },

    node_finalizacao_pergunta: {
      id: 'node_finalizacao_pergunta',
      title: '13. Finalização — Algo a Mais?',
      category: 'Encerramento',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'Posso te ajudar em algo a mais?',
        },
      ],
      interactiveType: 'quick_replies',
      fallbackMessage: 'Preciso que escolha entre Sim ou Não para continuar.\n\nPode selecionar uma das opções abaixo?',
      options: [
        {
          id: 'opt_algo_sim',
          title: 'Sim',
          nextNodeId: 'node_definir_destino',
          keywords: ['sim', 'quero', 'ajuda', '1'],
        },
        {
          id: 'opt_algo_nao',
          title: 'Não',
          nextNodeId: 'node_fim_atendimento',
          keywords: ['nao', 'não', 'obrigado', '2'],
        },
      ],
    },

    node_fim_atendimento: {
      id: 'node_fim_atendimento',
      title: 'Encerramento — Finalização Direta',
      category: 'Encerramento',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'Tudo pronto! Se precisar de mais alguma informação sobre sua viagem para {{destino}}, estou por aqui. Boa viagem! ✈️🌍',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        {
          id: 'opt_recomecar_tudo',
          title: '🔄 Iniciar novo planejamento',
          nextNodeId: 'node_onboarding_welcome',
        },
      ],
    },
  },
};

export const HEALTHCARE_FLOW: FlowDefinition = {
  id: 'clinica_saude',
  name: 'Clínica Bem-Estar (Triagem & Agendamento)',
  description: 'Microfluxo de identificação, CPF, lista de especialidades, agendamento de data/horário e comprovante em PDF.',
  botProfile: {
    name: 'Clínica Bem-Estar',
    verified: true,
    subtitle: 'Conta comercial verificada',
    avatarColor: '#00A884',
    avatarText: 'CB',
    phone: '+55 11 98822-4411',
    category: 'Medicina e Saúde',
  },
  startNodeId: 'node_hc_welcome',
  nodes: {
    node_hc_welcome: {
      id: 'node_hc_welcome',
      title: '01. Boas-vindas Clínica',
      category: 'Boas-vindas',
      delayMs: 700,
      messages: [
        {
          type: 'text',
          text: 'Olá! Sou a *Sofia*, assistente da *Clínica Bem-Estar* 🩺✨\n\nComo posso te chamar?',
        },
      ],
      interactiveType: 'text_input',
      inputPlaceholder: 'Digite seu nome...',
      inputType: 'text',
      variableToSave: 'userName',
      options: [
        { id: 'opt_hc_cpf', title: 'Continuar', nextNodeId: 'node_hc_menu' },
      ],
    },
    node_hc_menu: {
      id: 'node_hc_menu',
      title: '02. Menu Clínica',
      category: 'Menu',
      delayMs: 800,
      messages: [
        {
          type: 'text',
          text: 'Olá, *{{userName}}*! Como posso te ajudar hoje?',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        { id: 'hc_agendar', title: '📅 Agendar Consulta', nextNodeId: 'node_hc_specs' },
        { id: 'hc_exames', title: '📄 2ª Via de Exames', nextNodeId: 'node_hc_exames' },
      ],
    },
    node_hc_specs: {
      id: 'node_hc_specs',
      title: '03. Especialidades',
      category: 'Agendamento',
      delayMs: 800,
      messages: [
        {
          type: 'text',
          text: 'Selecione a especialidade desejada:',
        },
      ],
      interactiveType: 'list_message',
      listButtonLabel: '📋 Ver Especialidades Médicas',
      listTitle: 'Especialidades',
      listSections: [
        {
          title: 'Médicos Disponíveis',
          options: [
            { id: 'hc_cardio', title: 'Cardiologia', description: 'Check-up do coração', nextNodeId: 'node_hc_confirm' },
            { id: 'hc_derma', title: 'Dermatologia', description: 'Pele e alergias', nextNodeId: 'node_hc_confirm' },
            { id: 'hc_orto', title: 'Ortopedia', description: 'Coluna e articulações', nextNodeId: 'node_hc_confirm' },
          ],
        },
      ],
      options: [
        { id: 'hc_cardio', title: 'Cardiologia', nextNodeId: 'node_hc_confirm' },
        { id: 'hc_derma', title: 'Dermatologia', nextNodeId: 'node_hc_confirm' },
      ],
    },
    node_hc_confirm: {
      id: 'node_hc_confirm',
      title: '04. Confirmação do Agendamento',
      category: 'Confirmação',
      delayMs: 900,
      messages: [
        {
          type: 'text',
          text: '✨ *Consulta Agendada!*\n\nData: *Terça-feira às 14h*\nLocal: *Unidade Paulista*\n\nSegue comprovante:',
        },
        {
          type: 'document',
          mediaTitle: 'Comprovante_Agendamento.pdf',
          mediaSubtitle: 'Documento Oficial · 428 KB',
          fileSize: '428 KB',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        { id: 'hc_re', title: '🔄 Reiniciar', nextNodeId: 'node_hc_welcome' },
      ],
    },
    node_hc_exames: {
      id: 'node_hc_exames',
      title: '03B. Laudo de Exames',
      category: 'Exames',
      delayMs: 800,
      messages: [
        {
          type: 'text',
          text: 'Aqui está seu laudo mais recente liberado pelo laboratório:',
        },
        {
          type: 'document',
          mediaTitle: 'Laudo_Laboratorial.pdf',
          mediaSubtitle: 'Laboratório Central · 680 KB',
          fileSize: '680 KB',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        { id: 'hc_ex_menu', title: '⬅️ Voltar ao Menu', nextNodeId: 'node_hc_menu' },
      ],
    },
  },
};

export const CUSTOM_FIGMA_TEMPLATE: FlowDefinition = {
  id: 'meu_fluxo_figma',
  name: 'Meu Fluxo Personalizado (Figma)',
  description: 'Template pronto para você editar, colar suas telas do Figma ou importar o microfluxo em JSON.',
  botProfile: {
    name: 'Assistente Conversacional',
    verified: true,
    subtitle: 'Protótipo de Portfólio',
    avatarColor: '#008069',
    avatarText: 'UX',
    phone: '+55 11 90000-0000',
    category: 'Design Conversacional',
  },
  startNodeId: 'figma_01',
  nodes: {
    figma_01: {
      id: 'figma_01',
      title: '01. Tela Inicial do Figma',
      category: 'Início',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: 'Olá! Este é o protótipo interativo do projeto de *Design Conversacional* do Figma. 💬✨\n\nVocê pode editar os textos livremente clicando em "Editar Fluxo" na barra superior.',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        { id: 'fig_opt_1', title: '👉 Caminho A', nextNodeId: 'figma_02' },
        { id: 'fig_opt_2', title: '👉 Caminho B', nextNodeId: 'figma_03' },
      ],
    },
    figma_02: {
      id: 'figma_02',
      title: '02. Etapa do Caminho A',
      category: 'Fluxo A',
      delayMs: 700,
      messages: [
        {
          type: 'text',
          text: 'Você seguiu o *Caminho A*! Digite uma resposta no campo de texto abaixo:',
        },
      ],
      interactiveType: 'text_input',
      inputPlaceholder: 'Digite sua mensagem de teste...',
      options: [
        { id: 'fig_next_a', title: 'Continuar', nextNodeId: 'figma_conclusao' },
      ],
    },
    figma_03: {
      id: 'figma_03',
      title: '03. Etapa do Caminho B',
      category: 'Fluxo B',
      delayMs: 700,
      messages: [
        {
          type: 'text',
          text: 'Você escolheu o *Caminho B*! Veja as opções em formato de lista:',
        },
      ],
      interactiveType: 'list_message',
      listButtonLabel: '📋 Abrir Menu do Figma',
      listTitle: 'Opções do Microfluxo',
      listSections: [
        {
          title: 'Opções do Figma',
          options: [
            { id: 'fig_list_1', title: 'Opção 1', description: 'Descrição da opção 1', nextNodeId: 'figma_conclusao' },
            { id: 'fig_list_2', title: 'Opção 2', description: 'Descrição da opção 2', nextNodeId: 'figma_conclusao' },
          ],
        },
      ],
      options: [
        { id: 'fig_list_1', title: 'Opção 1', nextNodeId: 'figma_conclusao' },
      ],
    },
    figma_conclusao: {
      id: 'figma_conclusao',
      title: '04. Conclusão do Teste',
      category: 'Fim',
      delayMs: 600,
      messages: [
        {
          type: 'text',
          text: '🏁 Parabéns! Você chegou ao final do microfluxo de teste de usabilidade.',
        },
      ],
      interactiveType: 'quick_replies',
      options: [
        { id: 'fig_restart', title: '🔄 Reiniciar', nextNodeId: 'figma_01' },
      ],
    },
  },
};

export const INITIAL_FLOWS: FlowDefinition[] = [
  TRAVEL_FLOW,
  HEALTHCARE_FLOW,
  CUSTOM_FIGMA_TEMPLATE,
];
