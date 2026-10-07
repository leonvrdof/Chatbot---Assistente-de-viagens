/**
 * Travel Dates Parsing, Period Validation & Climate/Season Engine
 * Accurately extracts separate data_ida and data_volta from free text.
 * Calculates duration, identifies season, and analyzes climate context.
 */

export interface ParsedTravelDates {
  isValid: boolean;
  data_ida?: string; // DD/MM/YYYY
  data_volta?: string; // DD/MM/YYYY
  data_ida_obj?: Date;
  data_volta_obj?: Date;
  duracao_dias?: number;
  periodo_extenso?: string;
  estacao_ano?: string;
  contexto_climatico?: string;
  errorMessage?: string;
}

const MONTH_NAMES: Record<string, number> = {
  janeiro: 1, jan: 1,
  fevereiro: 2, fev: 2,
  marco: 3, mar: 3, março: 3,
  abril: 4, abr: 4,
  maio: 5, mai: 5,
  junho: 6, jun: 6,
  julho: 7, jul: 7,
  agosto: 8, ago: 8,
  setembro: 9, set: 9,
  outubro: 10, out: 10,
  novembro: 11, nov: 11,
  dezembro: 12, dez: 12,
};

const MONTH_DISPLAY = [
  '', 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

/**
 * Normalizes user text for date parsing
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Parses a single date token into day, month, year
 */
function parseDayMonthYear(dayStr: string, monthStr: string, yearStr?: string): { day: number; month: number; year: number } | null {
  const day = parseInt(dayStr, 10);
  let month = parseInt(monthStr, 10);

  if (isNaN(month)) {
    const cleanMonth = cleanText(monthStr);
    month = MONTH_NAMES[cleanMonth] || 0;
  }

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }

  let year = yearStr ? parseInt(yearStr, 10) : 2026;
  if (year < 100) {
    year += 2000;
  }

  return { day, month, year };
}

function formatDateString(d: { day: number; month: number; year: number }): string {
  const dd = d.day.toString().padStart(2, '0');
  const mm = d.month.toString().padStart(2, '0');
  return `${dd}/${mm}/${d.year}`;
}

/**
 * Interprets travel dates from conversational input in Portuguese.
 * Handles patterns such as:
 * - "12/11/2026 a 20/11/2026"
 * - "12/11/2026 ate 20/11/2026"
 * - "12/11/26 a 20/11/26"
 * - "12/11 a 20/11"
 * - "12 de novembro de 2026 a 20 de novembro de 2026"
 * - "de 12 a 20 de novembro de 2026"
 * - "vou dia 12 e volto dia 20 de novembro"
 * - "12 a 20 de novembro"
 */
export function parseTravelDates(input: string, destination = ''): ParsedTravelDates {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      errorMessage: 'Por favor, informe as datas de ida e volta da sua viagem.',
    };
  }

  const raw = cleanText(input);

  let date1: { day: number; month: number; year: number } | null = null;
  let date2: { day: number; month: number; year: number } | null = null;

  // Pattern 1: dd/mm/yyyy [a|ate|e|-|to] dd/mm/yyyy (or with 2-digit years / without years)
  // e.g. "12/11/2026 a 20/11/2026" or "12/11/26 a 20/11/26" or "12/11 a 20/11"
  const slashPattern = /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?.*?(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/;
  const slashMatch = raw.match(slashPattern);

  if (slashMatch) {
    const y1 = slashMatch[3] || slashMatch[6] || '2026';
    const y2 = slashMatch[6] || slashMatch[3] || '2026';
    date1 = parseDayMonthYear(slashMatch[1], slashMatch[2], y1);
    date2 = parseDayMonthYear(slashMatch[4], slashMatch[5], y2);
  }

  // Pattern 2: "de 12 a 20 de novembro [de 2026]" or "12 a 20 de novembro" or "12 a 20 de nov"
  if (!date1 || !date2) {
    const rangeSameMonth = /(\d{1,2})\s*(?:a|ate|e|-)\s*(\d{1,2})\s*de\s*([a-z]+)(?:\s*de\s*(\d{2,4}))?/;
    const matchSame = raw.match(rangeSameMonth);
    if (matchSame) {
      const monthName = matchSame[3];
      const year = matchSame[4] || '2026';
      date1 = parseDayMonthYear(matchSame[1], monthName, year);
      date2 = parseDayMonthYear(matchSame[2], monthName, year);
    }
  }

  // Pattern 3: "12 de novembro a 20 de novembro [de 2026]" or "12 de novembro a 20 de dezembro"
  if (!date1 || !date2) {
    const rangeDiffMonth = /(\d{1,2})\s*de\s*([a-z]+)(?:\s*de\s*(\d{2,4}))?\s*(?:a|ate|e|-)\s*(\d{1,2})\s*de\s*([a-z]+)(?:\s*de\s*(\d{2,4}))?/;
    const matchDiff = raw.match(rangeDiffMonth);
    if (matchDiff) {
      const y1 = matchDiff[3] || matchDiff[6] || '2026';
      const y2 = matchDiff[6] || matchDiff[3] || '2026';
      date1 = parseDayMonthYear(matchDiff[1], matchDiff[2], y1);
      date2 = parseDayMonthYear(matchDiff[4], matchDiff[5], y2);
    }
  }

  // Pattern 4: "vou dia 12 e volto dia 20 [de mes] [de ano]"
  if (!date1 || !date2) {
    const vouVolto = /(?:vou|ida|saida).*?(\d{1,2})(?:\/(\d{1,2})|\s*de\s*([a-z]+))?.*?(?:volto|volta|retorno).*?(\d{1,2})(?:\/(\d{1,2})|\s*de\s*([a-z]+))?(?:\s*de\s*(\d{2,4}))?/;
    const matchVou = raw.match(vouVolto);
    if (matchVou) {
      const month2 = matchVou[5] || matchVou[6] || '11';
      const month1 = matchVou[2] || matchVou[3] || month2;
      const year = matchVou[7] || '2026';
      date1 = parseDayMonthYear(matchVou[1], month1, year);
      date2 = parseDayMonthYear(matchVou[4], month2, year);
    }
  }

  // If could not parse both dates
  if (!date1 || !date2) {
    return {
      isValid: false,
      errorMessage: 'Não consegui identificar as duas datas (ida e volta).\n\nPode enviar novamente no formato dd/mm/aaaa a dd/mm/aaaa?\n\n_Exemplo:_ _12/11/2026 a 20/11/2026_',
    };
  }

  const dIda = new Date(date1.year, date1.month - 1, date1.day);
  const dVolta = new Date(date2.year, date2.month - 1, date2.day);

  // Validate dates are real calendar dates
  if (
    dIda.getFullYear() !== date1.year ||
    dIda.getMonth() !== date1.month - 1 ||
    dIda.getDate() !== date1.day ||
    dVolta.getFullYear() !== date2.year ||
    dVolta.getMonth() !== date2.month - 1 ||
    dVolta.getDate() !== date2.day
  ) {
    return {
      isValid: false,
      errorMessage: 'Uma das datas informadas parece não ser válida no calendário. Pode verificar e enviar novamente?',
    };
  }

  // Validate that return date is strictly after departure date
  if (dVolta.getTime() <= dIda.getTime()) {
    return {
      isValid: false,
      errorMessage: 'A data de volta precisa ser posterior à data de ida.\n\nPode enviar novamente com o período correto da viagem?',
    };
  }

  // Calculate duration in days
  const diffTime = Math.abs(dVolta.getTime() - dIda.getTime());
  const duracao_dias = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const strIda = formatDateString(date1);
  const strVolta = formatDateString(date2);

  // Build human readable period
  let periodo_extenso = '';
  if (date1.month === date2.month && date1.year === date2.year) {
    periodo_extenso = `${date1.day} a ${date2.day} de ${MONTH_DISPLAY[date1.month]} de ${date1.year}`;
  } else {
    periodo_extenso = `${date1.day} de ${MONTH_DISPLAY[date1.month]} a ${date2.day} de ${MONTH_DISPLAY[date2.month]} de ${date2.year}`;
  }

  // Determine season and climate context
  const climate = getSeasonAndClimate(destination, dIda, dVolta);

  return {
    isValid: true,
    data_ida: strIda,
    data_volta: strVolta,
    data_ida_obj: dIda,
    data_volta_obj: dVolta,
    duracao_dias,
    periodo_extenso,
    estacao_ano: climate.season,
    contexto_climatico: climate.description,
  };
}

/**
 * Calculates season and climate description based on destination and travel dates
 */
export function getSeasonAndClimate(
  destination: string,
  dIda: Date,
  dVolta: Date
): { season: string; description: string } {
  const destLower = (destination || '').toLowerCase();
  const month = dIda.getMonth() + 1; // 1 to 12

  const isNorthernHemisphere =
    destLower.includes('paris') ||
    destLower.includes('frança') ||
    destLower.includes('orlando') ||
    destLower.includes('nova york') ||
    destLower.includes('miami') ||
    destLower.includes('estados unidos') ||
    destLower.includes('eua') ||
    destLower.includes('londres') ||
    destLower.includes('inglaterra') ||
    destLower.includes('roma') ||
    destLower.includes('italia') ||
    destLower.includes('lisboa') ||
    destLower.includes('porto') ||
    destLower.includes('portugal') ||
    destLower.includes('madri') ||
    destLower.includes('barcelona') ||
    destLower.includes('espanha') ||
    destLower.includes('cancun') ||
    destLower.includes('mexico');

  let season = '';

  if (isNorthernHemisphere) {
    // Northern Hemisphere seasons
    if (month >= 3 && month <= 5) season = 'Primavera';
    else if (month >= 6 && month <= 8) season = 'Verão';
    else if (month >= 9 && month <= 11) season = 'Outono';
    else season = 'Inverno';
  } else {
    // Southern Hemisphere (Brazil, Argentina, Chile, etc.)
    if (month >= 12 || month <= 2) season = 'Verão';
    else if (month >= 3 && month <= 5) season = 'Outono';
    else if (month >= 6 && month <= 8) season = 'Inverno';
    else season = 'Primavera';
  }

  // Contextual description for climate
  let description = '';

  if (destLower.includes('porto de galinhas') || destLower.includes('maceio') || destLower.includes('maragogi') || destLower.includes('natal') || destLower.includes('fortaleza')) {
    if (month >= 10 || month <= 3) {
      description = `${MONTH_DISPLAY[month]} costuma ser um período favorável e ensolarado para aproveitar as praias da região, com calor e águas mornas, embora possam ocorrer chuvas pontuais de verão.`;
    } else {
      description = `Nesse período, as temperaturas no litoral continuam agradáveis, com brisa costeira e dias propícios para banho de mar.`;
    }
  } else if (destLower.includes('gramado') || destLower.includes('canela')) {
    if (month >= 5 && month <= 8) {
      description = `Período de inverno na Serra Gaúcha, ideal para curtir o clima frio acolhedor, gastronomia de fondue e vinícolas.`;
    } else if (month >= 10 || month <= 1) {
      description = `Período festivo com clima ameno e cidade movimentada pela programação especial da Serra.`;
    } else {
      description = `Clima ameno e agradável na Serra, excelente para passeios panorâmicos ao ar livre.`;
    }
  } else if (destLower.includes('rio de janeiro')) {
    if (month >= 12 || month <= 3) {
      description = `Verão carioca com dias ensolarados e praia movimentada, ideal para passeios ao ar livre e banho de mar.`;
    } else {
      description = `Temperaturas amenas e estáveis no Rio, com excelente visibilidade para os mirantes e pontos turísticos.`;
    }
  } else if (destLower.includes('paris') || destLower.includes('londres') || destLower.includes('roma') || destLower.includes('madri') || destLower.includes('lisboa')) {
    if (month >= 6 && month <= 8) {
      description = `Verão europeu com dias mais longos e temperaturas altas, perfeito para explorar praças e monumentos históricos.`;
    } else if (month >= 11 || month <= 2) {
      description = `Inverno europeu com clima frio charmoso, iluminação aconchegante e atrações culturais em museus.`;
    } else {
      description = `Meia-estação com clima ameno e agradável para caminhadas pelas cidades históricas.`;
    }
  } else if (destLower.includes('orlando') || destLower.includes('miami')) {
    if (month >= 6 && month <= 8) {
      description = `Verão na Flórida com calor intenso e parques abertos até mais tarde, com chuvas passageiras à tarde.`;
    } else {
      description = `Clima ameno e muito agradável na Flórida, excelente para curtir os parques temáticos com mais conforto térmico.`;
    }
  } else {
    description = `Período durante o(a) ${season.toLowerCase()}, com condições propícias para desfrutar das principais atrações de ${destination || 'seu destino'}.`;
  }

  return { season, description };
}
