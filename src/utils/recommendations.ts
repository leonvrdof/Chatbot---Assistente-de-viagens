/**
 * Intelligent Recommendation Engine for Lia | Assistente de Viagens
 * Cross-references all user criteria simultaneously:
 * - Clima: Frio vs Calor (validated against current seasonality)
 * - Praia: Com praia vs Sem praia (natureza, serra, histórica, urbana)
 * - Escopo: Nacional (Brasil) vs Internacional (Fora do Brasil)
 */

export interface RecommendedDestination {
  name: string;
  country: string;
  stateOrRegion?: string;
  displayTitle: string; // e.g. "Ushuaia — Argentina"
  porQueCombina: string;
  clima: string;
  destaque: string;
  isBeach: boolean;
  climateType: 'frio' | 'calor';
  scope: 'nacional' | 'internacional';
  style: 'praia' | 'natureza' | 'historica' | 'montanha' | 'aventura';
}

/**
 * Curated destination matrix strictly mapped to real conditions, seasonality and geography.
 * Tested for current period (Outubro / Primavera no HS, Outono no HN).
 */
export const DESTINATION_CATALOG: RecommendedDestination[] = [
  // =========================================================================
  // 1. FRIO + SEM PRAIA + INTERNACIONAL
  // =========================================================================
  {
    name: 'Ushuaia',
    country: 'Argentina',
    stateOrRegion: 'Terra do Fogo',
    displayTitle: 'Ushuaia — Argentina',
    porQueCombina: 'Destino internacional de montanha e geleiras no extremo sul do continente, perfeito para quem busca baixas temperaturas sem nenhum foco em praia.',
    clima: 'Clima subpolar e frio, com temperaturas médias entre 1°C e 9°C em outubro, ventos frios da Antártica e picos nevados ao redor do Canal Beagle.',
    destaque: 'Passeio no icônico Trem do Fim do Mundo pelo Parque Nacional Terra do Fogo e navegação para avistar leões-marinhos e geleiras.',
    isBeach: false,
    climateType: 'frio',
    scope: 'internacional',
    style: 'natureza',
  },
  {
    name: 'Reykjavik',
    country: 'Islândia',
    stateOrRegion: 'Região da Capital',
    displayTitle: 'Reykjavik — Islândia',
    porQueCombina: 'Capital nórdica internacional cercada por paisagens vulcânicas e geleiras, totalmente focada em natureza extrema e frio autêntico.',
    clima: 'Outono subártico gelado com médias entre 1°C e 6°C em outubro, ventos frios, noites longas e alta probabilidade de Aurora Boreal.',
    destaque: 'Expedição do Círculo Dourado (gêiseres de Strokkur e cachoeira de Gullfoss) e banho nas águas termais geotérmicas da Blue Lagoon.',
    isBeach: false,
    climateType: 'frio',
    scope: 'internacional',
    style: 'natureza',
  },
  {
    name: 'Zermatt',
    country: 'Suíça',
    stateOrRegion: 'Cantão de Valais',
    displayTitle: 'Zermatt — Suíça',
    porQueCombina: 'Charmoso vilarejo alpino internacional livre de carros, situado na base do Matterhorn, oferecendo frio alpino autêntico e montanhas imponentes sem praias.',
    clima: 'Frio alpino com temperaturas variando entre 0°C e 8°C em outubro, geadas frequentes e neve perene nos glaciares acima de 3.000 metros.',
    destaque: 'Subida de trem de cremalheira ao mirante de Gornergrat com vista panorâmica para o Matterhorn e fondue suíço tradicional em chalé de madeira.',
    isBeach: false,
    climateType: 'frio',
    scope: 'internacional',
    style: 'montanha',
  },
  {
    name: 'El Calafate',
    country: 'Argentina',
    stateOrRegion: 'Santa Cruz',
    displayTitle: 'El Calafate — Argentina',
    porQueCombina: 'Localizado no coração da Patagônia Argentina, combina clima frio com o espetáculo colossal das geleiras continentais, sem praias litorâneas.',
    clima: 'Frio patagônico com temperaturas entre 3°C e 10°C em outubro, clima seco, ventos característicos e sensação térmica baixa.',
    destaque: 'Caminhada nas passarelas e minitrekking com grampões sobre a colossal Geleira Perito Moreno.',
    isBeach: false,
    climateType: 'frio',
    scope: 'internacional',
    style: 'natureza',
  },
  {
    name: 'Banff',
    country: 'Canadá',
    stateOrRegion: 'Alberta',
    displayTitle: 'Banff — Canadá',
    porQueCombina: 'Destino internacional de montanha nas Rochosas Canadenses com florestas alpinas, lagos glaciais e frio intenso.',
    clima: 'Outono frio e primeiras nevascas em outubro, com temperaturas entre -2°C e 8°C e ar puro de alta montanha.',
    destaque: 'Paisagens deslumbrantes do Lago Louise e relaxamento nas fontes termais de Banff Upper Hot Springs.',
    isBeach: false,
    climateType: 'frio',
    scope: 'internacional',
    style: 'natureza',
  },
  {
    name: 'Innsbruck',
    country: 'Áustria',
    stateOrRegion: 'Tirol',
    displayTitle: 'Innsbruck — Áustria',
    porQueCombina: 'Capital dos Alpes austríacos rodeada de montanhas escarpadas, clima frio e rica história imperial.',
    clima: 'Outono alpino frio com temperaturas entre 2°C e 10°C em outubro e cumes nevados.',
    destaque: 'Subida no funicular Nordkette e centro histórico com o famoso Telhadinho de Ouro.',
    isBeach: false,
    climateType: 'frio',
    scope: 'internacional',
    style: 'montanha',
  },
  {
    name: 'Tromsø',
    country: 'Noruega',
    stateOrRegion: 'Troms',
    displayTitle: 'Tromsø — Noruega',
    porQueCombina: 'Porta de entrada para o Ártico internacional, perfeito para vivenciar frio autêntico e caçar auroras boreais.',
    clima: 'Clima subártico frio com médias entre 1°C e 5°C em outubro e ar polar puro.',
    destaque: 'Caçada à Aurora Boreal e teleférico Fjellheisen com vista espetacular dos fiordes.',
    isBeach: false,
    climateType: 'frio',
    scope: 'internacional',
    style: 'natureza',
  },

  // =========================================================================
  // 2. FRIO + SEM PRAIA + NACIONAL
  // =========================================================================
  {
    name: 'Gramado & Canela',
    country: 'Brasil',
    stateOrRegion: 'Rio Grande do Sul',
    displayTitle: 'Gramado & Canela — Brasil',
    porQueCombina: 'Principal polo de serra e frio do Brasil, com arquitetura em enxaimel, gastronomia colonial e total foco em montanha e tranquilidade.',
    clima: 'Clima ameno a frio de altitude na Serra Gaúcha, com noites frias (9°C a 14°C em outubro), cerração matinal e clima agradável para casacos.',
    destaque: 'Passeio de Maria Fumaça pelas vinícolas, Cascata do Caracol e fondue tradicional com lareira.',
    isBeach: false,
    climateType: 'frio',
    scope: 'nacional',
    style: 'montanha',
  },
  {
    name: 'Campos do Jordão',
    country: 'Brasil',
    stateOrRegion: 'São Paulo',
    displayTitle: 'Campos do Jordão — Brasil',
    porQueCombina: 'A cidade mais alta do Brasil na Serra da Mantiqueira, ideal para viagens de frio com gastronomia sofisticada e natureza de araucárias.',
    clima: 'Frio de montanha a 1.628 metros de altitude, com temperaturas mínimas entre 8°C e 12°C, ar fresco e noites convidativas.',
    destaque: 'Visita ao Parque Amantikir, subida no teleférico do Morro do Elefante e degustação de chocolates artesanais no Capivari.',
    isBeach: false,
    climateType: 'frio',
    scope: 'nacional',
    style: 'montanha',
  },
  {
    name: 'Urubici & São Joaquim',
    country: 'Brasil',
    stateOrRegion: 'Santa Catarina',
    displayTitle: 'Urubici & São Joaquim — Brasil',
    porQueCombina: 'Região serrana catarinense reconhecida pelas menores temperaturas do país, com cânions, cachoeiras e atmosfera rústica sem litoral.',
    clima: 'Clima subtropical de altitude frio, registrando mínimas entre 7°C e 13°C em outubro, com geadas eventuais e ventos frescos no topo dos morros.',
    destaque: 'Mirante da Pedra Furada no Morro da Igreja e visita às vinícolas de altitude de São Joaquim.',
    isBeach: false,
    climateType: 'frio',
    scope: 'nacional',
    style: 'natureza',
  },
  {
    name: 'Monte Verde',
    country: 'Brasil',
    stateOrRegion: 'Minas Gerais',
    displayTitle: 'Monte Verde — Brasil',
    porQueCombina: 'Vila serrana mineira incrustada na Mantiqueira, com clima ameno e frio, chalés com lareira e trilhas na mata.',
    clima: 'Frio serrano agradável com noites amenas (10°C a 13°C), cerração nas manhãs e brisa constante de montanha.',
    destaque: 'Trilha da Pedra Redonda com vista panorâmica da serra e circuito de fondues e trutas da vila.',
    isBeach: false,
    climateType: 'frio',
    scope: 'nacional',
    style: 'montanha',
  },

  // =========================================================================
  // 3. FRIO + COM PRAIA + INTERNACIONAL
  // =========================================================================
  {
    name: 'Vik (Costa Sul)',
    country: 'Islândia',
    stateOrRegion: 'Costa Sul',
    displayTitle: 'Vik — Islândia',
    porQueCombina: 'Destino litorâneo internacional onde o mar encontra picos nevados e colunas de basalto, sem calor ou turismo de banho tropical.',
    clima: 'Clima marítimo polar com ventos frios, médias entre 2°C e 7°C em outubro e ondas poderosas do Atlântico Norte.',
    destaque: 'Caminhada nas impressionantes areias negras da Praia de Reynisfjara e vista das falésias de Dyrhólaey.',
    isBeach: true,
    climateType: 'frio',
    scope: 'internacional',
    style: 'praia',
  },
  {
    name: 'Ilhas Lofoten',
    country: 'Noruega',
    stateOrRegion: 'Nordland',
    displayTitle: 'Ilhas Lofoten — Noruega',
    porQueCombina: 'Arquipélago costeiro no Círculo Polar Ártico com praias paradisíacas de água turquesa cercadas por muralhas de montanhas frias.',
    clima: 'Frio ártico com médias de 3°C a 8°C em outubro, ventos marítimos e noites escuras ideais para caçar a Aurora Boreal.',
    destaque: 'Praia ártica de Haukland, vilarejos de pescadores com casinhas vermelhas (rorbuer) e observação da Aurora Boreal.',
    isBeach: true,
    climateType: 'frio',
    scope: 'internacional',
    style: 'praia',
  },
  {
    name: 'Mar del Plata',
    country: 'Argentina',
    stateOrRegion: 'Buenos Aires',
    displayTitle: 'Mar del Plata — Argentina',
    porQueCombina: 'Tradicional cidade litorânea argentina no Atlântico Sul, onde as praias têm clima temperado frio e vento marítimo constante.',
    clima: 'Clima marítimo temperado e fresco, com temperaturas entre 9°C e 17°C em outubro e brisa fresca do oceano.',
    destaque: 'Passeio pela rambla costeira, observação de leões-marinhos no porto e gastronomia de pescados frescos.',
    isBeach: true,
    climateType: 'frio',
    scope: 'internacional',
    style: 'praia',
  },

  // =========================================================================
  // 4. FRIO + COM PRAIA + NACIONAL
  // =========================================================================
  {
    name: 'Praia do Rosa & Garopaba',
    country: 'Brasil',
    stateOrRegion: 'Santa Catarina',
    displayTitle: 'Praia do Rosa & Garopaba — Brasil',
    porQueCombina: 'Litoral sul com lagoas, costões e clima ameno/frio na primavera, famoso pela presença das baleias-francas.',
    clima: 'Clima subtropical costeiro com ventos frescos do sul (médias de 15°C a 21°C em outubro), ideal para casacos leves na beira da praia.',
    destaque: 'Avistamento de baleias-francas da terra firme e trilhas costeiras entre a Praia do Rosa e a Praia Vermelha.',
    isBeach: true,
    climateType: 'frio',
    scope: 'nacional',
    style: 'praia',
  },
  {
    name: 'Torres',
    country: 'Brasil',
    stateOrRegion: 'Rio Grande do Sul',
    displayTitle: 'Torres — Brasil',
    porQueCombina: 'A única praia de falésias rochosas do sul do país, unindo paisagem de litoral aberto com ares e temperaturas mais frescas.',
    clima: 'Clima temperado marítimo com brisas frias vindas do pampa gaúcho (médias de 14°C a 20°C em outubro).',
    destaque: 'Trilha do Parque Estadual da Guarita com vista espetacular das torres basálticas e da Ilha dos Lobos.',
    isBeach: true,
    climateType: 'frio',
    scope: 'nacional',
    style: 'praia',
  },

  // =========================================================================
  // 5. CALOR + COM PRAIA + NACIONAL
  // =========================================================================
  {
    name: 'Porto de Galinhas',
    country: 'Brasil',
    stateOrRegion: 'Pernambuco',
    displayTitle: 'Porto de Galinhas — Brasil',
    porQueCombina: 'Um dos destinos de praia mais completos do Nordeste, com piscinas naturais de águas mornas cristalinas e sol constante.',
    clima: 'Tropical quente e ensolarado durante o ano todo, com temperaturas entre 24°C e 30°C em outubro e mar a agradáveis 27°C.',
    destaque: 'Passeio de jangada tradicional até as piscinas naturais formadas pela maré baixa com peixes coloridos.',
    isBeach: true,
    climateType: 'calor',
    scope: 'nacional',
    style: 'praia',
  },
  {
    name: 'Maragogi',
    country: 'Brasil',
    stateOrRegion: 'Alagoas',
    displayTitle: 'Maragogi — Brasil',
    porQueCombina: 'Conhecido como o Caribe Brasileiro na Costa dos Corais, com piscinas naturais oceânicas (Galés) e praias paradisíacas de água morna.',
    clima: 'Calor tropical pleno, com sol intenso, céu aberto e temperaturas médias de 25°C a 31°C em outubro.',
    destaque: 'Passeio de catamarã até as Galés de Maragogi a 6 km da costa para mergulho com snorkel.',
    isBeach: true,
    climateType: 'calor',
    scope: 'nacional',
    style: 'praia',
  },
  {
    name: 'Jericoacoara',
    country: 'Brasil',
    stateOrRegion: 'Ceará',
    displayTitle: 'Jericoacoara — Brasil',
    porQueCombina: 'Vila pé na areia cercada por dunas móveis, lagoas de água doce e praias com ventos ideais para kitesurf e muito calor.',
    clima: 'Verão nordestino ininterrupto, calor de 26°C a 32°C em outubro, quase nenhuma chuva e brisa fresca.',
    destaque: 'Relaxar nas redes dentro da Lagoa do Paraíso e assistir ao espetáculo do pôr do sol na Duna do Pôr do Sol.',
    isBeach: true,
    climateType: 'calor',
    scope: 'nacional',
    style: 'praia',
  },
  {
    name: 'Fernando de Noronha',
    country: 'Brasil',
    stateOrRegion: 'Pernambuco',
    displayTitle: 'Fernando de Noronha — Brasil',
    porQueCombina: 'Santuário ecológico marinho exclusivo com algumas das praias mais bonitas do mundo (Baía do Sancho e Baía dos Porcos).',
    clima: 'Calor tropical de 26°C a 30°C com águas mornas transparentes e visibilidade submarina de até 50 metros.',
    destaque: 'Mergulho de snorkel com tartarugas e raias no Porto e vista panorâmica do Morro Dois Irmãos.',
    isBeach: true,
    climateType: 'calor',
    scope: 'nacional',
    style: 'praia',
  },

  // =========================================================================
  // 6. CALOR + COM PRAIA + INTERNACIONAL
  // =========================================================================
  {
    name: 'Cancún & Riviera Maya',
    country: 'México',
    stateOrRegion: 'Quintana Roo',
    displayTitle: 'Cancún & Riviera Maya — México',
    porQueCombina: 'O mar do Caribe azul-turquesa inconfundível, resorts all-inclusive de nível mundial e parques ecológicos imersivos.',
    clima: 'Calor caribenho intenso com médias entre 25°C e 31°C em outubro e temperatura da água na faixa dos 28°C.',
    destaque: 'Flutuação nos cenotes sagrados da selva maia e passeio de barco até a charmosa Isla Mujeres.',
    isBeach: true,
    climateType: 'calor',
    scope: 'internacional',
    style: 'praia',
  },
  {
    name: 'Punta Cana',
    country: 'República Dominicana',
    stateOrRegion: 'La Altagracia',
    displayTitle: 'Punta Cana — República Dominicana',
    porQueCombina: 'Quilômetros de areia branca ladeada por coqueiros, mar caribenho calmo e infraestrutura hoteleira voltada para descanso sob o sol.',
    clima: 'Tropical quente o ano inteiro, com temperaturas médias de 26°C a 31°C em outubro e sol constante.',
    destaque: 'Excursão de catamarã até a Ilha Saona com parada nas piscinas naturais repletas de estrelas-do-mar.',
    isBeach: true,
    climateType: 'calor',
    scope: 'internacional',
    style: 'praia',
  },
  {
    name: 'San Andrés',
    country: 'Colômbia',
    stateOrRegion: 'Arquipélago de San Andrés',
    displayTitle: 'San Andrés — Colômbia',
    porQueCombina: 'Famoso Mar de Sete Cores no Caribe colombiano, com clima quente, atmosfera caribenha alegre e excelente custo-benefício.',
    clima: 'Clima tropical quente e ensolarado com temperaturas médias de 26°C a 30°C.',
    destaque: 'Volta na ilha em carrinho de golfe (mula) e mergulho no aquário natural de Haynes Cay.',
    isBeach: true,
    climateType: 'calor',
    scope: 'internacional',
    style: 'praia',
  },

  // =========================================================================
  // 7. CALOR + SEM PRAIA + NACIONAL
  // =========================================================================
  {
    name: 'Bonito',
    country: 'Brasil',
    stateOrRegion: 'Mato Grosso do Sul',
    displayTitle: 'Bonito — Brasil',
    porQueCombina: 'A capital do ecoturismo sustentável brasileiro, com rios de nascente ultracristalinos, cavernas e muito calor sem depender de litoral.',
    clima: 'Clima tropical quente do Centro-Oeste, com termômetros marcando de 23°C a 33°C em outubro e águas cálidas para flutuação.',
    destaque: 'Flutuação guiada nas correntes transparentes do Rio da Prata cercado por cardumes de piraputangas e dourados.',
    isBeach: false,
    climateType: 'calor',
    scope: 'nacional',
    style: 'natureza',
  },
  {
    name: 'Chapada dos Veadeiros',
    country: 'Brasil',
    stateOrRegion: 'Goiás',
    displayTitle: 'Chapada dos Veadeiros — Brasil',
    porQueCombina: 'Cânions imponentes de quartzo, cachoeiras majestosas e a rica biodiversidade do Cerrado sob sol radiante.',
    clima: 'Calor e dias ensolarados com temperaturas entre 22°C e 32°C em outubro, perfeito para banhos refrescantes em cachoeiras.',
    destaque: 'Trilha dos Saltos no Parque Nacional e banho nas águas cristalinas do Vale da Lua.',
    isBeach: false,
    climateType: 'calor',
    scope: 'nacional',
    style: 'natureza',
  },
  {
    name: 'Foz do Iguaçu',
    country: 'Brasil',
    stateOrRegion: 'Paraná',
    displayTitle: 'Foz do Iguaçu — Brasil',
    porQueCombina: 'Uma das Novas Sete Maravilhas da Natureza, unindo a força monumental das quedas d’água com sol e calor subtropical sem praia.',
    clima: 'Clima subtropical quente na primavera com temperaturas entre 20°C e 30°C em outubro.',
    destaque: 'Passeio do Macuco Safari de barco bem próximo às quedas das Cataratas e visita ao Parque das Aves.',
    isBeach: false,
    climateType: 'calor',
    scope: 'nacional',
    style: 'natureza',
  },
  {
    name: 'Jalapão',
    country: 'Brasil',
    stateOrRegion: 'Tocantins',
    displayTitle: 'Jalapão — Brasil',
    porQueCombina: 'Oásis no coração do Brasil com fervedouros onde é impossível afundar, dunas douradas e calor genuíno do interior.',
    clima: 'Calor constante do cerrado com temperaturas entre 24°C e 35°C e noites agradáveis sob céu estrelado.',
    destaque: 'Banho de flutuação no Fervedouro Bela Vista e pôr do sol nas Dunas do Jalapão.',
    isBeach: false,
    climateType: 'calor',
    scope: 'nacional',
    style: 'natureza',
  },

  // =========================================================================
  // 8. CALOR + SEM PRAIA + INTERNACIONAL
  // =========================================================================
  {
    name: 'Mendoza',
    country: 'Argentina',
    stateOrRegion: 'Região de Cuyo',
    displayTitle: 'Mendoza — Argentina',
    porQueCombina: 'Capital do vinho aos pés da Cordilheira dos Andes, com dias ensolarados, vinhedos floridos de Malbec e gastronomia requintada sem praia.',
    clima: 'Primavera ensolarada e agradável/quente, com tardes de 22°C a 27°C em outubro, pouca umidade e sol brilhante.',
    destaque: 'Degustação guiada de vinhos nas bodegas de Valle de Uco com almoço harmonizado de passos olhando os Andes.',
    isBeach: false,
    climateType: 'calor',
    scope: 'internacional',
    style: 'historica',
  },
  {
    name: 'Roma',
    country: 'Itália',
    stateOrRegion: 'Lácio',
    displayTitle: 'Roma — Itália',
    porQueCombina: 'Museu a céu aberto internacional repleto de monumentos milenares, praças históricas e clima ameno/quente de outono europeu.',
    clima: 'Outono mediterrâneo suave e ensolarado com máximas confortáveis de 21°C a 24°C em outubro.',
    destaque: 'Tour pelo Coliseu, Fórum Romano e saborear gelato artesanal passeando pela Fontana di Trevi.',
    isBeach: false,
    climateType: 'calor',
    scope: 'internacional',
    style: 'historica',
  },
  {
    name: 'Orlando',
    country: 'Estados Unidos',
    stateOrRegion: 'Flórida',
    displayTitle: 'Orlando — Estados Unidos',
    porQueCombina: 'Epicentro mundial de entretenimento e parques temáticos no centro da Flórida, longe do mar e com clima quente.',
    clima: 'Calor subtropical agradável com dias ensolarados e temperaturas médias entre 21°C e 29°C em outubro.',
    destaque: 'Experiência imersiva nos quatro parques temáticos da Disney e complexo Universal Studios.',
    isBeach: false,
    climateType: 'calor',
    scope: 'internacional',
    style: 'aventura',
  },
];

export interface SearchCriteria {
  clima?: 'frio' | 'calor';
  querPraia?: boolean;
  escopo?: 'nacional' | 'internacional';
  estilo?: 'praia' | 'natureza' | 'historica';
}

/**
 * Filters the destination catalog strictly enforcing ALL criteria in combination.
 * Never ignores any specified filter.
 */
export function getRecommendations(criteria: SearchCriteria): RecommendedDestination[] {
  return DESTINATION_CATALOG.filter((dest) => {
    // 1. Clima
    if (criteria.clima && criteria.clima !== ('tanto_faz' as any)) {
      if (dest.climateType !== criteria.clima) return false;
    }

    // 2. Escopo (Nacional vs Internacional)
    if (criteria.escopo) {
      if (dest.scope !== criteria.escopo) return false;
    }

    // 3. Praia
    if (criteria.querPraia !== undefined) {
      if (criteria.querPraia && !dest.isBeach) return false;
      if (!criteria.querPraia && dest.isBeach) return false;
    }

    // 4. Estilo se especificado e não conflitar com praia
    if (criteria.estilo && criteria.estilo !== 'praia') {
      if (dest.isBeach) return false;
    }

    return true;
  });
}

/**
 * Paginates recommendations returning exactly 2 options per page.
 */
export function getPagedRecommendations(
  criteria: SearchCriteria,
  offset: number = 0,
  pageSize: number = 2
): {
  destinations: RecommendedDestination[];
  hasMore: boolean;
  total: number;
  nextOffset: number;
} {
  const all = getRecommendations(criteria);
  const paged = all.slice(offset, offset + pageSize);
  const nextOffset = offset + pageSize;
  const hasMore = nextOffset < all.length;

  return {
    destinations: paged,
    hasMore,
    total: all.length,
    nextOffset: hasMore ? nextOffset : 0,
  };
}

/**
 * Formats a list of recommendations into the exact standard markdown format requested:
 * **[Nome do destino] — [País]**
 * * **Por que combina:** ...
 * * **Clima:** ...
 * * **Destaque:** ...
 */
export function formatRecommendationsMarkdown(destinations: RecommendedDestination[]): string {
  if (destinations.length === 0) {
    return 'Não encontrei destinos que atendam 100% a todos os critérios simultaneamente sem comprometer as preferências selecionadas.';
  }

  return destinations
    .map((dest) => {
      return `**${dest.displayTitle}**\n\n* **Por que combina:** ${dest.porQueCombina}\n* **Clima:** ${dest.clima}\n* **Destaque:** ${dest.destaque}`;
    })
    .join('\n\n');
}
