/**
 * Destination validation and recommendation engine for Lia | Assistente de Viagens.
 * Validates user-entered cities, states, countries, and tourist destinations.
 * Provides authentic, personalized accommodations (hotéis/pousadas) and guided tours.
 */

export interface DestinationData {
  name: string;
  lodging1: string;
  lodging2: string;
  tour1: string;
  tour2: string;
  tourOther: string;
}

// Curated database of top tourist destinations with authentic hotels and tours
const KNOWN_DESTINATIONS: Record<string, DestinationData> = {
  'porto de galinhas': {
    name: 'Porto de Galinhas',
    lodging1: 'Vivá Porto de Galinhas Resort',
    lodging2: 'Pousada Recanto dos Corais',
    tour1: 'Passeio de Buggy Ponta a Ponta',
    tour2: 'Mergulho de Jangada nas Piscinas Naturais',
    tourOther: 'Passeio de Catamarã na Praia dos Carneiros',
  },
  'gramado': {
    name: 'Gramado',
    lodging1: 'Hotel Colline de France',
    lodging2: 'Pousada Bella Terra Gramado',
    tour1: 'Tour Linha Bella com Almoço Típico',
    tour2: 'Tour Trem Maria Fumaça e Vinícolas',
    tourOther: 'Parque Snowland e Lago Negro',
  },
  'canela': {
    name: 'Canela',
    lodging1: 'Grande Hotel Canela',
    lodging2: 'Pousada Blumenberg Canela',
    tour1: 'Visita Guiada ao Parque do Caracol e Bondinhos',
    tour2: 'Tour Trem Maria Fumaça com Degustação',
    tourOther: 'Catedral de Pedra e Parque Terra Mágica Florybal',
  },
  'rio de janeiro': {
    name: 'Rio de Janeiro',
    lodging1: 'Copacabana Palace Hotel',
    lodging2: 'Pousada Ipanema Beach House',
    tour1: 'Cristo Redentor e Pão de Açúcar Express com Guia',
    tour2: 'Passeio de Barco na Baía de Guanabara',
    tourOther: 'Tour Cultural Santa Teresa e Escadaria Selarón',
  },
  'sao paulo': {
    name: 'São Paulo',
    lodging1: 'Hotel Unique Jardins',
    lodging2: 'Tivoli Mofarrej São Paulo',
    tour1: 'Tour Cultural Avenida Paulista e MASP',
    tour2: 'Roteiro Gastronômico Mercado Municipal e Liberdade',
    tourOther: 'Passeio no Parque Ibirapuera e Beco do Batman',
  },
  'salvador': {
    name: 'Salvador',
    lodging1: 'Fera Palace Hotel Centro Histórico',
    lodging2: 'Pousada do Pilar Pelourinho',
    tour1: 'Tour Histórico no Pelourinho com Guia Credenciado',
    tour2: 'Passeio Panorâmico Farol da Barra e Bonfim',
    tourOther: 'Passeio de Escuna pelas Ilhas da Baía de Todos os Santos',
  },
  'maragogi': {
    name: 'Maragogi',
    lodging1: 'Salinas Maragogi All Inclusive Resort',
    lodging2: 'Pousada Camurim Grande',
    tour1: 'Passeio de Catamarã às Galés (Piscinas Naturais)',
    tour2: 'Tour de Buggy pelas Praias do Norte e Antunes',
    tourOther: 'Visita ao Mirante de Maragogi e Trilha dos Visgueiros',
  },
  'jericoacoara': {
    name: 'Jericoacoara',
    lodging1: 'Essenza Hotel Jericoacoara',
    lodging2: 'Pousada Vila Kalango',
    tour1: 'Passeio de Buggy Lado Leste (Lagoa do Paraíso e Buraco Azul)',
    tour2: 'Passeio de Buggy Lado Oeste (Tatajuba e Mangue Seco)',
    tourOther: 'Caminhada Ecológica até a Pedra Furada e Duna do Pôr do Sol',
  },
  'fernando de noronha': {
    name: 'Fernando de Noronha',
    lodging1: 'Pousada Zé Maria',
    lodging2: 'Pousada Triboju',
    tour1: 'Ilha Tour Completo com Guia e Snorkel',
    tour2: 'Passeio de Barco com Pranchinha no Mar de Dentro',
    tourOther: 'Trilha do Atalaia e Mirante dos Golfinhos',
  },
  'foz do iguacu': {
    name: 'Foz do Iguaçu',
    lodging1: 'Belmond Hotel das Cataratas',
    lodging2: 'Recanto Cataratas Thermas Resort & Convention',
    tour1: 'Passeio Guiado Cataratas do Iguaçu e Macuco Safari',
    tour2: 'Visita Guiada ao Parque das Aves e Marco das Três Fronteiras',
    tourOther: 'Tour Panorâmico Usina Hidrelétrica de Itaipu',
  },
  'maceio': {
    name: 'Maceió',
    lodging1: 'Jatiúca Hotel & Resort',
    lodging2: 'Pousada Ponta Verde Maceió',
    tour1: 'Passeio para a Praia do Francês e Barra de São Miguel',
    tour2: 'Excursão de Barco às Piscinas Naturais de Pajuçara',
    tourOther: 'Tour Ecológico nas Dunas de Marapé',
  },
  'natal': {
    name: 'Natal',
    lodging1: 'Wish Natal Resort Ponta Negra',
    lodging2: 'Pousada Manary Praia Hotel',
    tour1: 'Passeio de Buggy com Emoção nas Dunas de Genipabu',
    tour2: 'Tour de Barco e Mergulho nos Parrachos de Maracajaú',
    tourOther: 'Passeio para a Praia de Pipa e Praia do Amor',
  },
  'fortaleza': {
    name: 'Fortaleza',
    lodging1: 'Gran Marquise Hotel Meireles',
    lodging2: 'Hotel Praia Centro Fortaleza',
    tour1: 'Excursão Guiada ao Beach Park em Aquiraz',
    tour2: 'Passeio de 1 Dia para Morro Branco e Canoa Quebrada',
    tourOther: 'City Tour Centro Histórico, Dragão do Mar e Mercado Central',
  },
  'florianopolis': {
    name: 'Florianópolis',
    lodging1: 'Costão do Santinho Resort All Inclusive',
    lodging2: 'Pousada dos Chás Hotel Boutique',
    tour1: 'Tour de Barco à Ilha do Campeche com Snorkel',
    tour2: 'Passeio Panorâmico Lagoa da Conceição e Joaquina',
    tourOther: 'Roteiro Histórico em Santo Antônio de Lisboa e Ribeirão da Ilha',
  },
  'curitiba': {
    name: 'Curitiba',
    lodging1: 'Nomaa Hotel Batel',
    lodging2: 'Radisson Hotel Curitiba',
    tour1: 'Passeio de Trem da Serra do Mar até Morretes',
    tour2: 'City Tour Jardim Botânico, Ópera de Arame e Museu Oscar Niemeyer',
    tourOther: 'Tour Gastronômico no Bairro de Santa Felicidade',
  },
  'belo horizonte': {
    name: 'Belo Horizonte',
    lodging1: 'Hotel Fasano Belo Horizonte Lourdes',
    lodging2: 'Radisson Blu Belo Horizonte Savassi',
    tour1: 'Tour Conjunto Arquitetônico da Pampulha e Igreja São Francisco',
    tour2: 'Excursão Guiada ao Instituto de Arte Contemporânea Inhotim',
    tourOther: 'Roteiro Gastronômico no Mercado Central de BH',
  },
  'brasilia': {
    name: 'Brasília',
    lodging1: 'Royal Tulip Brasília Alvorada',
    lodging2: 'B Hotel Brasília',
    tour1: 'Tour Arquitetônico Oscar Niemeyer e Eixo Monumental',
    tour2: 'Visita Guiada ao Congresso Nacional e Catedral Metropolitana',
    tourOther: 'Passeio de Barco no Lago Paranoá ao Entardecer',
  },
  'bonito': {
    name: 'Bonito',
    lodging1: 'Zagaia Eco Resort Bonito',
    lodging2: 'Pousada Olho D’Água Bonito',
    tour1: 'Flutuação com Guia no Rio da Prata e Buraco das Araras',
    tour2: 'Passeio na Gruta do Lago Azul e Grutas de São Miguel',
    tourOther: 'Trilha e Cachoeiras da Boca da Onça',
  },
  'campos do jordao': {
    name: 'Campos do Jordão',
    lodging1: 'Hotel Frontenac Capivari',
    lodging2: 'Pousada Villa D’Amore',
    tour1: 'Tour Guiado na Vila Capivari e Morro do Elefante',
    tour2: 'Visita ao Parque Amantikir Jardins que Falam',
    tourOther: 'Passeio no Horto Florestal e Fábrica de Chocolates',
  },
  'monte verde': {
    name: 'Monte Verde',
    lodging1: 'Kuriuwa Hotel Monte Verde',
    lodging2: 'Pousada SPA Mirante da Colina',
    tour1: 'Passeio de 4x4 até a Pedra Redonda e Trilha do Platô',
    tour2: 'Tour da Truta e Degustação de Chocolates Artesanais',
    tourOther: 'Visita ao Orquidário e Fábrica de Cervejas Artesanais',
  },
  'paraty': {
    name: 'Paraty',
    lodging1: 'Pousada Literária de Paraty',
    lodging2: 'Pousada do Sandi Centro Histórico',
    tour1: 'Passeio de Escuna pelas Ilhas e Praias da Baía de Paraty',
    tour2: 'Tour a Pé pelo Centro Histórico com Guia Credenciado',
    tourOther: 'Passeio de Jeep 4x4 pelas Cachoeiras e Alambiques da Serra',
  },
  'buzios': {
    name: 'Búzios',
    lodging1: 'Insolito Boutique Hotel & Spa Ferradura',
    lodging2: 'Pousada Abracadabra Búzios',
    tour1: 'Passeio de Escuna pelas Praias de João Fernandes e Azeda',
    tour2: 'Tour Panorâmico de Trolley pelos Mirantes da Península',
    tourOther: 'Caminhada Guiada na Orla Bardot e Rua das Pedras',
  },
  'arraial do cabo': {
    name: 'Arraial do Cabo',
    lodging1: 'Pousada dos Chás Arraial',
    lodging2: 'Pousada Solar da Praia',
    tour1: 'Passeio de Barco com Parada no Farol e Prainhas do Pontal',
    tour2: 'Batismo de Mergulho com Cilindro em Águas Cristalinas',
    tourOther: 'Trilha Guiada da Praia do Forno e Pôr do Sol no Pontal do Atalaia',
  },
  'ilhabela': {
    name: 'Ilhabela',
    lodging1: 'DPNY Beach Hotel & SPA Praia do Curral',
    lodging2: 'Pousada Ilhabela Vila',
    tour1: 'Passeio de Jipe 4x4 até a Praia dos Castelhanos',
    tour2: 'Passeio de Escuna até a Praia da Fome e Jabaquara',
    tourOther: 'Trilha das Cachoeiras da Água Branca com Guia',
  },
  'ubatuba': {
    name: 'Ubatuba',
    lodging1: 'Itamambuca Eco Resort',
    lodging2: 'Pousada Kaliman Ubatuba',
    tour1: 'Passeio de Lancha à Ilha das Couves e Ilha do Prumirim',
    tour2: 'Trilha das 7 Praias Desertas com Guia Ecológico',
    tourOther: 'Visita ao Projeto Tamar e Aquário de Ubatuba',
  },
  'porto seguro': {
    name: 'Porto Seguro',
    lodging1: 'La Torre Resort All Inclusive Praia do Mutá',
    lodging2: 'Pousada Quinta do Sol Praia Hotel',
    tour1: 'City Tour Histórico da Cidade Alta e Marco do Descobrimento',
    tour2: 'Passeio de Barco e Mergulho no Parque Marinho de Recife de Fora',
    tourOther: 'Excursão de 1 Dia para Trancoso e Praia do Espelho',
  },
  'trancoso': {
    name: 'Trancoso',
    lodging1: 'UXUA Casa Hotel & Spa Quadrado',
    lodging2: 'Pousada Capim Santo Trancoso',
    tour1: 'Caminhada Histórica pelo Quadrado e Igreja São João Batista',
    tour2: 'Passeio de Quadriciclo até a Praia de Itapororoca e Rio da Barra',
    tourOther: 'Excursão Guiada para a Paradisíaca Praia do Espelho',
  },
  'morro de sao paulo': {
    name: 'Morro de São Paulo',
    lodging1: 'Patachocas Resort Quarta Praia',
    lodging2: 'Pousada Villa dos Corais',
    tour1: 'Passeio Volta à Ilha de Lancha (Boipeba e Piscinas de Moreré)',
    tour2: 'Descida de Tirolesa do Farol até a Primeira Praia',
    tourOther: 'Caminhada Ecológica até a Praia de Gamboa com Banho de Argila',
  },
  'lencois maranhenses': {
    name: 'Lençóis Maranhenses',
    lodging1: 'Porto Preguiças Resort Barreirinhas',
    lodging2: 'Pousada Encantes da Natureza',
    tour1: 'Circuito Lagoa Azul e Lagoa do Peixe em 4x4',
    tour2: 'Passeio de Voadeira pelo Rio Preguiças até Caburé e Atins',
    tourOther: 'Circuito Lagoa Bonita com Pôr do Sol nas Dunas',
  },
  'chapada diamantina': {
    name: 'Chapada Diamantina',
    lodging1: 'Hotel Canto das Águas Lençóis',
    lodging2: 'Pousada Vila Serrano Lençóis',
    tour1: 'Trilha Guiada ao Morro do Pai Inácio e Gruta da Lapa Doce',
    tour2: 'Flutuação na Pratinha e Poço do Diabo com Guia',
    tourOther: 'Trilha para a Cachoeira da Fumaça com Vista Panorâmica',
  },
  'chapada dos veadeiros': {
    name: 'Chapada dos Veadeiros',
    lodging1: 'Pousada Inácia Alto Paraíso',
    lodging2: 'Pousada Casa Rosa São Jorge',
    tour1: 'Trilha dos Saltos e Corredeiras no Parque Nacional',
    tour2: 'Passeio Guiado ao Vale da Lua e Cachoeiras Almécegas',
    tourOther: 'Visita às Cachoeiras de Santa Bárbara e Candaru em Cavalcante',
  },
  'jalapao': {
    name: 'Jalapão',
    lodging1: 'Jalapão Ecolodge Mateiros',
    lodging2: 'Pousada Santa Helena Ponte Alta',
    tour1: 'Expedição 4x4 aos Fervedouros Bela Vista e Ceiça',
    tour2: 'Trilha e Pôr do Sol nas Dunas do Jalapão',
    tourOther: 'Visita à Cachoeira da Formiga e Comunidade Mumbuca (Capim Dourado)',
  },
  'caldas novas': {
    name: 'Caldas Novas',
    lodging1: 'diRoma Exclusive Resort & Spa',
    lodging2: 'Prive Ilhas do Lago Eco Resort',
    tour1: 'Ingresso Guiado e Acesso ao Hot Park Rio Quente',
    tour2: 'Tour Ecológico no Parque Estadual da Serra de Caldas Novas',
    tourOther: 'Visita ao Jardim Japonês e Monumento das Águas Termais',
  },
  'balneario camboriu': {
    name: 'Balneário Camboriú',
    lodging1: 'Infinity Blue Resort & Spa Praia dos Amores',
    lodging2: 'Hotel Sibara Flat & Convenções',
    tour1: 'Passeio de Teleférico no Parque Unipraias e Praia de Laranjeiras',
    tour2: 'Excursão Guiada de 1 Dia para o Beto Carrero World',
    tourOther: 'Visita à Roda Gigante FG Big Wheel e Molhe da Barra Sul',
  },
  'ouro preto': {
    name: 'Ouro Preto',
    lodging1: 'Hotel Solar do Rosário Ouro Preto',
    lodging2: 'Pousada do Ouvidor Ouro Preto',
    tour1: 'Tour Histórico a Pé pela Praça Tiradentes e Igreja São Francisco de Assis',
    tour2: 'Descida Guiada a uma Mina de Ouro do Século XVIII',
    tourOther: 'Passeio de Trem da Vale até Mariana com Guia',
  },
  'tiradentes': {
    name: 'Tiradentes',
    lodging1: 'Pousada Pequena Tiradentes',
    lodging2: 'Solar da Ponte Tiradentes',
    tour1: 'Passeio de Charrete Histórica e Matriz de Santo Antônio',
    tour2: 'Passeio de Maria Fumaça até São João del-Rei',
    tourOther: 'Circuito Gastronômico e de Artesanato Mineiro',
  },
  'paris': {
    name: 'Paris',
    lodging1: 'Hôtel Plaza Athénée',
    lodging2: 'Hôtel Le Relais Saint-Germain',
    tour1: 'Acesso Prioritário à Torre Eiffel e Cruzeiro no Rio Sena',
    tour2: 'Visita Guiada às Obras-Primas do Museu do Louvre',
    tourOther: 'Excursão Guiada de 1 Dia ao Palácio de Versalhes',
  },
  'buenos aires': {
    name: 'Buenos Aires',
    lodging1: 'Alvear Palace Hotel Recoleta',
    lodging2: 'Palermo Soho Boutique Hotel',
    tour1: 'Noite de Show de Tango no Madero com Jantar Tradicional',
    tour2: 'City Tour Histórico Caminito, Plaza de Mayo e Recoleta',
    tourOther: 'Passeio de Barco e Almoço nas Ilhas do Delta do Tigre',
  },
  'santiago': {
    name: 'Santiago',
    lodging1: 'The Singular Santiago Lastarria',
    lodging2: 'Hotel Cumbres Lastarria',
    tour1: 'Tour Vinícola Concha y Toro com Degustação Premium',
    tour2: 'Passeio Panorâmico na Cordilheira dos Andes e Valle Nevado',
    tourOther: 'Excursão de 1 Dia a Valparaíso e Viña del Mar',
  },
  'orlando': {
    name: 'Orlando',
    lodging1: 'Disney’s Grand Floridian Resort & Spa',
    lodging2: 'Universal’s Cabana Bay Beach Resort',
    tour1: 'Tour Guiado nos Parques Magic Kingdom & Epcot',
    tour2: 'Visita Guiada ao Centro Espacial Kennedy da NASA',
    tourOther: 'Passeio de Aerobarco pelos Everglades e Outlets',
  },
  'miami': {
    name: 'Miami',
    lodging1: 'The Setai Miami Beach',
    lodging2: 'Faena Hotel Miami Beach',
    tour1: 'Passeio de Lancha Speedboat pelas Mansões dos Famosos na Biscayne Bay',
    tour2: 'Tour a Pé pelo Distrito Art Déco de South Beach e Wynwood Walls',
    tourOther: 'Excursão ao Parque Nacional dos Everglades com Jacarés',
  },
  'nova york': {
    name: 'Nova York',
    lodging1: 'The Plaza Hotel Fifth Avenue',
    lodging2: 'Arlo SoHo New York',
    tour1: 'Ingresso Express para o Empire State Building e Estátua da Liberdade',
    tour2: 'Tour Guiado pelo Central Park, Times Square e Broadway',
    tourOther: 'Caminhada Guiada na Ponte do Brooklyn e Bairro DUMBO',
  },
  'lisboa': {
    name: 'Lisboa',
    lodging1: 'Tivoli Avenida Liberdade Lisboa',
    lodging2: 'Pousada de Lisboa Praça do Comércio',
    tour1: 'Tour Histórico a Pé por Belém, Torre de Belém e Pastéis de Belém',
    tour2: 'Excursão Guiada a Sintra, Palácio da Pena e Cabo da Roca',
    tourOther: 'Noite de Fado Tradicional com Jantar em Alfama',
  },
  'porto': {
    name: 'Porto',
    lodging1: 'The Yeatman Hotel Vila Nova de Gaia',
    lodging2: 'Pestana Vintage Porto Hotel',
    tour1: 'Cruzeiro das Seis Pontes no Rio Douro e Visita às Caves de Vinho do Porto',
    tour2: 'Tour Guiado pela Livraria Lello, Torre dos Clérigos e Ribeira',
    tourOther: 'Excursão de 1 Dia pelo Vale do Douro com Degustação e Almoço',
  },
  'roma': {
    name: 'Roma',
    lodging1: 'Hotel Artemide Roma',
    lodging2: 'Pousada Navona Boutique',
    tour1: 'Visita Guiada Sem Filas ao Coliseu, Fórum Romano e Palatino',
    tour2: 'Tour Exclusivo pelos Museus do Vaticano e Capela Sistina',
    tourOther: 'Roteiro Noturno pelas Fontes e Praças de Roma (Fontana di Trevi)',
  },
  'londres': {
    name: 'Londres',
    lodging1: 'The Ritz London Mayfair',
    lodging2: 'The Chesterfield Mayfair',
    tour1: 'Tour Guiado na Torre de Londres e Jóias da Coroa',
    tour2: 'Ingresso para a London Eye com Cruzeiro no Rio Tâmisa',
    tourOther: 'Passeio Histórico Palácio de Buckingham e Abadia de Westminster',
  },
  'cancun': {
    name: 'Cancún',
    lodging1: 'Hyatt Ziva Cancun All Inclusive',
    lodging2: 'Secrets The Vine Cancun Adults Only',
    tour1: 'Excursão Guiada a Chichén Itzá com Banho em Cenote Sagrado',
    tour2: 'Passeio de Catamarã para Isla Mujeres com Snorkel nos Recifes',
    tourOther: 'Acesso VIP ao Parque Eco-Arqueológico Xcaret com Show Noturno',
  },
  'bariloche': {
    name: 'Bariloche',
    lodging1: 'Llao Llao Resort, Golf-Spa',
    lodging2: 'Hotel Panamericano Bariloche',
    tour1: 'Circuito Chico Panorâmico e Subida ao Cerro Campanario',
    tour2: 'Passeio de Barco à Ilha Victoria e Bosque de Arrayanes',
    tourOther: 'Excursão Guiada ao Cerro Catedral com Atividades de Neve',
  },
  'madri': {
    name: 'Madri',
    lodging1: 'The Westin Palace Madrid',
    lodging2: 'Only YOU Boutique Hotel Madrid',
    tour1: 'Visita Guiada ao Museu do Prado e Palácio Real de Madri',
    tour2: 'Tour Panorâmico Porta de Alcalá, Gran Vía e Parque do Retiro',
    tourOther: 'Excursão de 1 Dia a Toledo com Transporte e Guia',
  },
  'barcelona': {
    name: 'Barcelona',
    lodging1: 'Hotel Arts Barcelona',
    lodging2: 'W Barcelona Barceloneta',
    tour1: 'Visita Guiada Sem Fila à Basílica da Sagrada Família',
    tour2: 'Passeio pelo Parque Güell e Obras de Gaudí no Passeig de Gràcia',
    tourOther: 'Tour a Pé pelo Bairro Gótico e Las Ramblas',
  },
  'ushuaia': {
    name: 'Ushuaia',
    lodging1: 'Arakur Ushuaia Resort & Spa',
    lodging2: 'Los Cauquenes Resort & Spa',
    tour1: 'Passeio no Trem do Fim do Mundo pelo Parque Nacional',
    tour2: 'Navegação no Canal Beagle com Visita aos Lobos-Marinhos',
    tourOther: 'Trekking à Laguna Esmeralda com Guia Especializado',
  },
  'reykjavik': {
    name: 'Reykjavik',
    lodging1: 'The Reykjavik EDITION Luxury Hotel',
    lodging2: 'Canopy by Hilton Reykjavik City Centre',
    tour1: 'Excursão Guiada pelo Círculo Dourado e Cascata Gullfoss',
    tour2: 'Tour Noturno de Caçada à Aurora Boreal com Guia Astrônomo',
    tourOther: 'Entrada Premium nas Águas Termais da Blue Lagoon',
  },
  'zermatt': {
    name: 'Zermatt',
    lodging1: 'The Omnia Mountain Lodge Zermatt',
    lodging2: 'Grand Hotel Zermatterhof',
    tour1: 'Passeio de Trem de Cremalheira até o Mirante de Gornergrat',
    tour2: 'Visita ao Palácio de Gelo do Matterhorn Glacier Paradise',
    tourOther: 'Roteiro Gastronômico com Fondue Suíço Tradicional em Chalé',
  },
  'el calafate': {
    name: 'El Calafate',
    lodging1: 'Hotel Posada Los Álamos',
    lodging2: 'Xelena Hotel & Suites Lago Argentino',
    tour1: 'Passarelas e Minitrekking com Grampões na Geleira Perito Moreno',
    tour2: 'Navegação Todo Glaciares pelo Lago Argentino e Glaciar Upsala',
    tourOther: 'Cavalgada Estância Cristina com Almoço Patagônico Típico',
  },
  'banff': {
    name: 'Banff',
    lodging1: 'Fairmont Banff Springs Castelo das Rochosas',
    lodging2: 'Rimrock Resort Hotel Banff',
    tour1: 'Excursão Guiada ao Lago Louise e Lago Moraine',
    tour2: 'Passeio na Gôndola de Banff com Vista Panorâmica dos Picos',
    tourOther: 'Banho Relaxante nas Fontes Termais de Banff Upper Hot Springs',
  },
  'punta cana': {
    name: 'Punta Cana',
    lodging1: 'Hard Rock Hotel & Casino Punta Cana All Inclusive',
    lodging2: 'Secrets Cap Cana Resort & Spa',
    tour1: 'Excursão de Catamarã à Ilha Saona com Piscinas Naturais',
    tour2: 'Mergulho com Snorkel nos Recifes de Corais de Cabeza de Toro',
    tourOther: 'Passeio de Buggy pelas Dunas e Praia de Macao',
  },
  'mendoza': {
    name: 'Mendoza',
    lodging1: 'Park Hyatt Mendoza Hotel, Casino & Spa',
    lodging2: 'Cavas Wine Lodge Luján de Cuyo',
    tour1: 'Tour pelas Melhores Bodegas de Valle de Uco com Almoço Harmonizado',
    tour2: 'Excursão de Alta Montanha aos Pés do Aconcágua',
    tourOther: 'Cavalgada ao Entardecer pelos Vinhedos com Degustação de Malbec',
  },
};

// Broad dictionary of valid cities, regions, tourist spots and countries
// Grouped by search terms
const VALID_CITIES_SET = new Set([
  // Capitais brasileiras
  'sao paulo', 'rio de janeiro', 'brasilia', 'salvador', 'fortaleza', 'belo horizonte',
  'manaus', 'curitiba', 'recife', 'porto alegre', 'belem', 'goiania', 'sao luis',
  'maceio', 'natal', 'campo grande', 'teresina', 'joao pessoa', 'aracaju', 'cuiaba',
  'porto velho', 'florianopolis', 'macapa', 'rio branco', 'vitoria', 'boa vista', 'palmas',
  // Polos turísticos brasileiros
  'porto de galinhas', 'gramado', 'canela', 'maragogi', 'jericoacoara', 'jeri', 'fernando de noronha',
  'noronha', 'foz do iguacu', 'bonito', 'campos do jordao', 'monte verde', 'ilhabela',
  'ubatuba', 'buzios', 'arraial do cabo', 'cabo frio', 'paraty', 'angra dos reis',
  'petropolis', 'ouro preto', 'tiradentes', 'capitolio', 'lencois maranhenses', 'barreirinhas',
  'chapada diamantina', 'lencois', 'chapada dos veadeiros', 'alto paraiso', 'sao jorge',
  'jalapao', 'alter do chao', 'morro de sao paulo', 'praia do forte', 'trancoso', 'arraial d ajuda',
  'arraial dajuda', 'porto seguro', 'itacare', 'praia da pipa', 'pipa', 'tibau do sul',
  'canoa quebrada', 'caldas novas', 'rio quente', 'balneario camboriu', 'bombinhas', 'penha',
  'beto carrero', 'bento goncalves', 'garibaldi', 'blumenau', 'pomerode', 'urubici',
  'sao joaquim', 'brotas', 'serra negra', 'aguas de lindoia', 'holambra', 'santos',
  'guaruja', 'sao sebastiao', 'maresias', 'juquehy', 'bertioga', 'ilheus', 'itaparica',
  'valenca', 'sao miguel dos milagres', 'milagres', 'marapendi', 'carneiros', 'tamandare',
  'porto de pedras', 'japaratinga', 'praia do gunga', 'coruripe', 'ilha grande', 'abraao',
  'parnamirim', 'saquarema', 'arraial', 'terepolis', 'teresopolis', 'visconde de maua',
  'penedo', 'maringa', 'parnaiba', 'delta do parnaiba', 'sao raimundo nonato', 'serra da capivara',
  'sao miguel das missoes', 'cambara do sul', 'aparados da serra', 'torres', 'pelotas',
  'santarem', 'presidente figueiredo', 'marajo', 'soure', 'salinopolis', 'braganca',
  // Cidades importantes do Brasil
  'campinas', 'sorocaba', 'ribeirao preto', 'sao jose dos campos', 'santo andre', 'sao bernardo',
  'osasco', 'guarulhos', 'sao caetano', 'jundiai', 'piracicaba', 'bauru', 'franca',
  'araraquara', 'sao carlos', 'marilia', 'presidente prudente', 'niteroi', 'nova iguacu',
  'duque de caxias', 'sao goncalo', 'petropolis', 'volta redonda', 'campos dos goytacazes',
  'macae', 'angra', 'uberlandia', 'uberaba', 'juiz de fora', 'montes claros', 'ipatinga',
  'governador valadares', 'pocos de caldas', 'divinopolis', 'sete lagoas', 'londrina',
  'maringa', 'ponta grossa', 'cascavel', 'foz', 'guarapuava', 'paranagua', 'toledo',
  'joinville', 'chapeco', 'criciuma', 'itajai', 'brusque', 'tubarao', 'lages',
  'caxias do sul', 'canoas', 'santa maria', 'gravatai', 'viamao', 'novo hamburgo',
  'sao leopoldo', 'rio grande', 'passo fundo', 'uruguaiana', 'bento', 'anapolis',
  'rio verde', 'aparecida de goiania', 'caldas', 'dourados', 'corumba', 'tres lagoas',
  'pontaporã', 'rondonopolis', 'sinop', 'varzea grande', 'alta floresta', 'feira de santana',
  'vitoria da conquista', 'camacari', 'juazeiro', 'itabuna', 'lauro de freitas', 'teixeira de freitas',
  'campina grande', 'patos', 'sousa', 'caruaru', 'petrolina', 'olinda', 'paulista',
  'jaboatao dos guararapes', 'garanhuns', 'vitoria de santo antao', 'arcoverde', 'sobral',
  'juazeiro do norte', 'crato', 'caucaia', 'maracanau', 'imperatriz', 'caxias',
  'timon', 'parnaiba', 'parnamirim', 'mossoro', 'caico', 'lagarto', 'itabaiana',
  'estancia', 'nossa senhora do socorro', 'araguaina', 'gurupi', 'ji-parana', 'ariquemes',
  'vilhena', 'cruzeiro do sul', 'santana',
  // Estados do Brasil
  'bahia', 'pernambuco', 'ceara', 'alagoas', 'sergipe', 'paraiba', 'rio grande do norte',
  'maranhao', 'piaui', 'minas gerais', 'minas', 'espirito santo', 'rio de janeiro',
  'sao paulo', 'parana', 'santa catarina', 'rio grande do sul', 'goias', 'mato grosso',
  'mato grosso do sul', 'tocantins', 'amazonas', 'para', 'amapa', 'rondonia', 'acre', 'roraima',
  // Destinos e Países Internacionais
  'buenos aires', 'bariloche', 'mendoza', 'cordoba', 'salta', 'ushuaia', 'el calafate',
  'santiago', 'valparaiso', 'vina del mar', 'atacama', 'san pedro de atacama', 'puerto varas',
  'montevideu', 'punta del este', 'colonia del sacramento', 'lima', 'cusco', 'machu picchu',
  'arequipa', 'bogota', 'cartagena', 'medellin', 'san andres', 'salar de uyuni', 'la paz',
  'assuncao', 'orlando', 'miami', 'nova york', 'new york', 'los angeles', 'las vegas',
  'san francisco', 'chicago', 'washington', 'boston', 'vancouver', 'toronto', 'montreal',
  'cancun', 'cidade do mexico', 'playa del carmen', 'tulum', 'cozumel', 'punta cana',
  'havana', 'varadero', 'paris', 'londres', 'london', 'roma', 'milao', 'florenca',
  'veneza', 'napoles', 'lisboa', 'porto', 'algarve', 'faro', 'coimbra', 'madri',
  'madrid', 'barcelona', 'sevilha', 'valencia', 'ibiza', 'maiorca', 'amsterda',
  'amsterdam', 'berlim', 'munique', 'frankfurt', 'viena', 'salzburgo', 'praga',
  'budapeste', 'atenas', 'santorini', 'mykonos', 'creta', 'dublin', 'edimburgo',
  'zurique', 'genebra', 'interlaken', 'bruxelas', 'bruges', 'estocolmo', 'oslo',
  'copenhague', 'helsinque', 'toquio', 'tokyo', 'kyoto', 'osaka', 'bangkok', 'phuket',
  'chiang mai', 'bali', 'jacarta', 'singapura', 'dubai', 'abu dhabi', 'doha',
  'cairo', 'luxor', 'cidade do cabo', 'cape town', 'johanesburgo', 'marrakech',
  'casablanca', 'sydney', 'melbourne', 'auckland', 'queenstown',
  // Países
  'brasil', 'argentina', 'chile', 'uruguai', 'peru', 'colombia', 'estados unidos',
  'eua', 'usa', 'canada', 'mexico', 'portugal', 'espanha', 'franca', 'italia',
  'inglaterra', 'reino unido', 'alemanha', 'holanda', 'paises baixos', 'suica',
  'grecia', 'turquia', 'japao', 'tailandia', 'indonesia', 'egito', 'africa do sul',
  'australia', 'nova zelandia', 'austria', 'irlanda', 'belgica'
]);

// Normalization function to remove accents, extra spaces, punctuation
export function normalizeText(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Stop words and conversational phrases to strip from destination input
const CONVERSATIONAL_PREFIXES = [
  'quero viajar para',
  'quero ir para',
  'quero ir pra',
  'gostaria de ir para',
  'gostaria de ir pra',
  'gostaria de conhecer',
  'pretendo viajar para',
  'pretendo ir para',
  'pretendo ir pra',
  'vou viajar para',
  'vou ir para',
  'vou para',
  'vou pra',
  'viagem para',
  'viagem pra',
  'viagem a',
  'destino',
  'cidade de',
  'para',
  'pra',
  'em',
  'no',
  'na',
];

// Negative/gibberish terms that are definitely NOT valid destinations
const INVALID_PATTERNS = [
  'nao sei', 'nao tenho', 'tanto faz', 'qualquer', 'nada', 'sei la', 'nenhum',
  'nao', 'sim', 'teste', 'asdf', 'xyz', 'blabla', 'banana', 'carro', 'hotel',
  'aviao', 'onibus', 'viajar', 'turismo', 'praia', 'cidade', 'frio', 'calor',
  'ajuda', 'oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'opa', 'opa!',
  'opa lia', 'valeu', 'obrigado', 'tudo bem', '...', '??', '123', '456', '789'
];

/**
 * Validates a user destination input.
 * Returns { isValid: boolean, destinationName?: string, details?: DestinationData }
 */
export function validateDestination(input: string): {
  isValid: boolean;
  destinationName?: string;
  details?: DestinationData;
} {
  if (!input || typeof input !== 'string') {
    return { isValid: false };
  }

  let cleaned = normalizeText(input);

  // If input is too short or pure digits
  if (cleaned.length < 3 || /^\d+$/.test(cleaned)) {
    return { isValid: false };
  }

  // Check if matches known invalid terms
  if (INVALID_PATTERNS.some((pat) => cleaned === pat || cleaned.startsWith(pat + ' '))) {
    return { isValid: false };
  }

  // Strip conversational prefixes
  for (const prefix of CONVERSATIONAL_PREFIXES) {
    if (cleaned.startsWith(prefix + ' ')) {
      cleaned = cleaned.substring(prefix.length).trim();
    }
  }

  if (cleaned.length < 2) {
    return { isValid: false };
  }

  // Check exact or partial match in curated KNOWN_DESTINATIONS
  for (const [key, dest] of Object.entries(KNOWN_DESTINATIONS)) {
    if (cleaned === key || cleaned.includes(key) || key.includes(cleaned)) {
      return {
        isValid: true,
        destinationName: dest.name,
        details: dest,
      };
    }
  }

  // Check in broad valid cities/countries set
  let matchedCity: string | null = null;
  if (VALID_CITIES_SET.has(cleaned)) {
    matchedCity = cleaned;
  } else {
    // Check if cleaned contains any known city or vice versa
    for (const city of VALID_CITIES_SET) {
      // Must match whole word or substantial substring
      if (cleaned === city || (city.length > 4 && cleaned.includes(city))) {
        matchedCity = city;
        break;
      }
    }
  }

  if (matchedCity) {
    // Format nicely with Title Case
    const formatted = formatDestinationTitle(matchedCity);
    const generatedDetails = buildDynamicDestinationData(formatted);
    return {
      isValid: true,
      destinationName: formatted,
      details: generatedDetails,
    };
  }

  // If not found in any geographic database
  return { isValid: false };
}

/**
 * Capitalizes a destination string into standard Portuguese / Geographic format
 */
export function formatDestinationTitle(text: string): string {
  const lowercaseWords = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'd\''];
  return text
    .split(' ')
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && lowercaseWords.includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Builds realistic accommodations and authentic guided tours for any valid destination
 */
export function buildDynamicDestinationData(destName: string): DestinationData {
  const lower = destName.toLowerCase();

  // Check if beach style
  const isBeach = lower.includes('praia') || lower.includes('mar') || lower.includes('ilha') ||
                  lower.includes('litoral') || lower.includes('porto') || lower.includes('arraial');

  // Check if mountain / serra
  const isMountain = lower.includes('serra') || lower.includes('monte') || lower.includes('chapada') ||
                     lower.includes('canela') || lower.includes('gramado') || lower.includes('jordao');

  if (isBeach) {
    return {
      name: destName,
      lodging1: `Resort Beira-Mar ${destName} All Inclusive`,
      lodging2: `Pousada Pé na Areia ${destName}`,
      tour1: `Passeio de Buggy e Piscinas Naturais em ${destName}`,
      tour2: `Passeio de Barco com Mergulho Guiado em ${destName}`,
      tourOther: `Roteiro do Pôr do Sol e Gastronomia Litorânea em ${destName}`,
    };
  }

  if (isMountain) {
    return {
      name: destName,
      lodging1: `Hotel Boutique das Montanhas em ${destName}`,
      lodging2: `Pousada Charme da Serra com Lareira em ${destName}`,
      tour1: `Tour Panorâmico pelos Parques e Mirantes de ${destName}`,
      tour2: `Circuito Gastronômico e Degustação Artesanal em ${destName}`,
      tourOther: `Trilha Ecológica com Guia Local em ${destName}`,
    };
  }

  return {
    name: destName,
    lodging1: `Hotel ${destName} Premium & Spa`,
    lodging2: `Pousada Boutique Central em ${destName}`,
    tour1: `City Tour Histórico e Panorâmico com Guia em ${destName}`,
    tour2: `Tour Cultural e Gastronômico com Guia Local em ${destName}`,
    tourOther: `Roteiro Exclusivo pelos Melhores Pontos Turísticos de ${destName}`,
  };
}

/**
 * Helper to get guided tours for a destination (used across the prototype)
 */
export function getPasseiosForDestino(destName: string) {
  const validation = validateDestination(destName);
  if (validation.isValid && validation.details) {
    return {
      passeio_1: validation.details.tour1,
      passeio_2: validation.details.tour2,
      outras: validation.details.tourOther,
    };
  }
  return {
    passeio_1: `Passeio Panorâmico com Guia Local em ${destName || 'Destino'}`,
    passeio_2: `Tour Histórico e Cultural em ${destName || 'Destino'}`,
    outras: `Roteiro Gastronômico com Guia em ${destName || 'Destino'}`,
  };
}

/**
 * Helper to get lodging suggestions for a destination
 */
export function getHospedagensForDestino(destName: string) {
  const validation = validateDestination(destName);
  if (validation.isValid && validation.details) {
    return {
      hospedagem_1: validation.details.lodging1,
      hospedagem_2: validation.details.lodging2,
    };
  }
  return {
    hospedagem_1: `Hotel ${destName || 'Destino'} Premium & Spa`,
    hospedagem_2: `Pousada Boutique Central em ${destName || 'Destino'}`,
  };
}

export interface LodgingPreferenceOption {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  nextNodeId: string;
}

export interface LodgingPreferenceConfig {
  hasBeach: boolean;
  beachStatus: 'in_city' | 'nearby_100km' | 'none';
  beachNote?: string;
  questionText: string;
  subText: string;
  options: LodgingPreferenceOption[];
}

// Known cities with coastal beaches directly in the city
const COASTAL_BEACH_CITIES = new Set([
  'porto de galinhas', 'recife', 'olinda', 'tamandare', 'carneiros',
  'maragogi', 'japaratinga', 'sao miguel dos milagres', 'milagres', 'maceio',
  'barra de sao miguel', 'gunga', 'coruripe', 'natal', 'pipa', 'praia da pipa',
  'tibau do sul', 'genipabu', 'maracajau', 'joao pessoa', 'cabedelo',
  'fortaleza', 'aquiraz', 'cumbuco', 'canoa quebrada', 'jericoacoara', 'jeri',
  'salvador', 'morro de sao paulo', 'boipeba', 'praia do forte', 'imbassai',
  'itacare', 'ilheus', 'porto seguro', 'arraial d ajuda', 'arraial dajuda',
  'trancoso', 'caraiva', 'aracaju', 'sao luis', 'atins', 'rio de janeiro',
  'niteroi', 'buzios', 'arraial do cabo', 'cabo frio', 'saquarema', 'marica',
  'angra dos reis', 'angra', 'ilha grande', 'paraty', 'santos', 'guaruja',
  'sao sebastiao', 'maresias', 'juquehy', 'ilhabela', 'ubatuba', 'caraguatatuba',
  'bertioga', 'praia grande', 'itanhaem', 'peruibe', 'florianopolis', 'floripa',
  'balneario camboriu', 'bombinhas', 'itapema', 'porto belo', 'penha',
  'garopaba', 'imbituba', 'praia do rosa', 'laguna', 'torres', 'vitoria',
  'vila velha', 'guarapari', 'cancun', 'playa del carmen', 'tulum', 'miami',
  'punta cana', 'barcelona', 'ibiza', 'maiorca', 'algarve', 'faro', 'sydney',
  'phuket', 'bali'
]);

// Cities with beach within ~100 km (e.g. São Paulo is ~70-80 km from Santos/Guarujá)
const CITIES_WITH_BEACH_NEARBY_100KM: Record<string, { beachName: string; distanceKm: number }> = {
  'sao paulo': { beachName: 'Santos e Guarujá', distanceKm: 70 },
  'blumenau': { beachName: 'Balneário Camboriú e Penha', distanceKm: 55 },
  'joinville': { beachName: 'São Francisco do Sul', distanceKm: 45 },
  'criciuma': { beachName: 'Balneário Rincão', distanceKm: 30 },
  'tubarao': { beachName: 'Laguna', distanceKm: 35 },
};

/**
 * Checks if destination has a coastal beach in city or accessible within 100km
 */
export function checkBeachPresence(destination: string): {
  hasBeach: boolean;
  status: 'in_city' | 'nearby_100km' | 'none';
  nearbyDetails?: { beachName: string; distanceKm: number };
} {
  const norm = normalizeText(destination);

  // Check if city itself has direct coastal beach
  for (const beachCity of COASTAL_BEACH_CITIES) {
    if (norm === beachCity || norm.includes(beachCity) || beachCity.includes(norm)) {
      return { hasBeach: true, status: 'in_city' };
    }
  }

  // Check if city is within 100km of beach
  for (const [cityKey, details] of Object.entries(CITIES_WITH_BEACH_NEARBY_100KM)) {
    if (norm === cityKey || norm.includes(cityKey)) {
      return { hasBeach: true, status: 'nearby_100km', nearbyDetails: details };
    }
  }

  return { hasBeach: false, status: 'none' };
}

/**
 * Generates dynamic, contextual lodging preference options tailored to the destination
 */
export function getLodgingPreferenceConfig(destination: string): LodgingPreferenceConfig {
  const beachInfo = checkBeachPresence(destination);
  const norm = normalizeText(destination);
  const destDisplay = destination || 'seu destino';

  // 1. Direct coastal beach
  if (beachInfo.status === 'in_city') {
    return {
      hasBeach: true,
      beachStatus: 'in_city',
      questionText: `Vou te ajudar a encontrar uma hospedagem boa para ${destDisplay}. Você prefere ficar mais perto da praia, no centro, ou sem preferência?`,
      subText: 'Onde você prefere se hospedar?',
      options: [
        {
          id: 'opt_hosp_praia',
          title: 'Perto da praia',
          keywords: ['praia', 'beira mar', 'mar', 'litoral', '1'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_centro',
          title: 'No centro',
          keywords: ['centro', 'cidade', '2'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_sem_pref',
          title: 'Sem preferência',
          keywords: ['sem preferencia', 'tanto faz', 'qualquer', '3'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
      ],
    };
  }

  // 2. Beach accessible within 100 km (e.g. São Paulo -> Santos / Guarujá a ~70 km)
  if (beachInfo.status === 'nearby_100km' && beachInfo.nearbyDetails) {
    const { beachName, distanceKm } = beachInfo.nearbyDetails;
    return {
      hasBeach: true,
      beachStatus: 'nearby_100km',
      beachNote: `Praia em ${beachName} a ~${distanceKm} km`,
      questionText: `Vou te ajudar a encontrar uma hospedagem para ${destDisplay}. Como as praias do litoral (${beachName}) ficam a cerca de ${distanceKm} km, você prefere ficar no centro / região nobre, perto dos pontos turísticos, ou no litoral próximo?`,
      subText: 'Onde você prefere se hospedar?',
      options: [
        {
          id: 'opt_hosp_centro',
          title: 'No centro / Região nobre',
          keywords: ['centro', 'bairros nobres', 'paulista', 'jardins', '1'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_turisticos',
          title: 'Perto dos pontos turísticos',
          keywords: ['pontos turisticos', 'turistico', 'atracoes', '2'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_praia',
          title: `Litoral próximo (${beachName})`,
          keywords: ['litoral', 'praia', 'santos', 'guaruja', '3'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_sem_pref',
          title: 'Sem preferência',
          keywords: ['sem preferencia', 'tanto faz', 'qualquer', '4'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
      ],
    };
  }

  // 3. Mountain / Serra / Nature destinations (no coastal beach)
  const isMountain =
    norm.includes('gramado') || norm.includes('canela') || norm.includes('campos do jordao') ||
    norm.includes('monte verde') || norm.includes('urubici') || norm.includes('sao joaquim') ||
    norm.includes('petropolis') || norm.includes('teresopolis') || norm.includes('bento goncalves') ||
    norm.includes('bariloche') || norm.includes('visconde de maua');

  if (isMountain) {
    return {
      hasBeach: false,
      beachStatus: 'none',
      questionText: `Vou te ajudar a encontrar uma hospedagem boa para ${destDisplay}. Você prefere ficar mais no centro, perto da natureza, ou sem preferência?`,
      subText: 'Onde você prefere se hospedar?',
      options: [
        {
          id: 'opt_hosp_centro',
          title: 'No centro',
          keywords: ['centro', 'vila', 'cidade', '1'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_natureza',
          title: 'Perto da natureza',
          keywords: ['natureza', 'bosque', 'serra', 'montanha', '2'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_sem_pref',
          title: 'Sem preferência',
          keywords: ['sem preferencia', 'tanto faz', 'qualquer', '3'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
      ],
    };
  }

  // 4. Historical / Colonial cities (no coastal beach)
  const isHistoric =
    norm.includes('ouro preto') || norm.includes('tiradentes') || norm.includes('diamantina') ||
    norm.includes('sao joao del rei') || norm.includes('roma') || norm.includes('cusco');

  if (isHistoric) {
    return {
      hasBeach: false,
      beachStatus: 'none',
      questionText: `Vou te ajudar a encontrar uma hospedagem boa para ${destDisplay}. Você prefere ficar no centro histórico, perto dos principais pontos turísticos, ou sem preferência?`,
      subText: 'Onde você prefere se hospedar?',
      options: [
        {
          id: 'opt_hosp_historico',
          title: 'No centro histórico',
          keywords: ['centro historico', 'historico', 'centro', '1'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_turisticos',
          title: 'Perto dos principais pontos turísticos',
          keywords: ['pontos turisticos', 'turistico', 'atracoes', '2'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
        {
          id: 'opt_hosp_sem_pref',
          title: 'Sem preferência',
          keywords: ['sem preferencia', 'tanto faz', 'qualquer', '3'],
          nextNodeId: 'node_hospedagem_apresentacao',
        },
      ],
    };
  }

  // 5. Inland Capitals and Metropolises without beach (Cuiabá, Brasília, Belo Horizonte, Curitiba, Goiânia, Campo Grande, Paris, Orlando, etc.)
  return {
    hasBeach: false,
    beachStatus: 'none',
    questionText: `Vou te ajudar a encontrar uma hospedagem boa para ${destDisplay}. Você prefere ficar mais no centro, perto dos principais pontos turísticos, ou sem preferência?`,
    subText: 'Onde você prefere se hospedar?',
    options: [
      {
        id: 'opt_hosp_centro',
        title: 'No centro',
        keywords: ['centro', 'cidade', 'central', '1'],
        nextNodeId: 'node_hospedagem_apresentacao',
      },
      {
        id: 'opt_hosp_turisticos',
        title: 'Perto dos principais pontos turísticos',
        keywords: ['pontos turisticos', 'turistico', 'atracoes', 'parques', '2'],
        nextNodeId: 'node_hospedagem_apresentacao',
      },
      {
        id: 'opt_hosp_sem_pref',
        title: 'Sem preferência',
        keywords: ['sem preferencia', 'tanto faz', 'qualquer', '3'],
        nextNodeId: 'node_hospedagem_apresentacao',
      },
    ],
  };
}

/**
 * Returns dynamic customized accommodations for a destination based on location preference
 */
export function getHospedagensForDestinoAndPreference(destName: string, preferenceTitle: string) {
  const normDest = normalizeText(destName);
  const normPref = normalizeText(preferenceTitle);

  // Cuiabá
  if (normDest.includes('cuiaba')) {
    if (normPref.includes('turistico') || normPref.includes('pontos')) {
      return {
        hospedagem_1: 'Hotel Fazenda Mato Grosso Turístico',
        hospedagem_2: 'Pousada Portal das Águas Pantaneira',
      };
    }
    return {
      hospedagem_1: 'Hotel Deville Prime Cuiabá Central',
      hospedagem_2: 'Delmond Hotel Executivo Centro',
    };
  }

  // Gramado & Canela
  if (normDest.includes('gramado') || normDest.includes('canela')) {
    if (normPref.includes('natureza') || normPref.includes('bosque')) {
      return {
        hospedagem_1: 'Hotel Ritta Höppner junto ao Bosque',
        hospedagem_2: 'Pousada Morada dos Pássaros na Serra',
      };
    }
    return {
      hospedagem_1: 'Hotel Colline de France Centro',
      hospedagem_2: 'Pousada Bella Terra Gramado Central',
    };
  }

  // Porto de Galinhas
  if (normDest.includes('porto de galinhas')) {
    if (normPref.includes('praia')) {
      return {
        hospedagem_1: 'Vivá Porto de Galinhas Resort Beira-Mar',
        hospedagem_2: 'Pousada Recanto dos Corais Pé na Areia',
      };
    }
    return {
      hospedagem_1: 'Hotel Village Porto Central da Vila',
      hospedagem_2: 'Pousada Porto De Amigos Centro',
    };
  }

  // São Paulo
  if (normDest.includes('sao paulo')) {
    if (normPref.includes('praia') || normPref.includes('litoral') || normPref.includes('santos')) {
      return {
        hospedagem_1: 'Parque Balneário Hotel Gonzaga (Santos a 70 km)',
        hospedagem_2: 'Casa Grande Hotel Resort & Spa (Guarujá a 80 km)',
      };
    }
    if (normPref.includes('turistico')) {
      return {
        hospedagem_1: 'Renaissance São Paulo Hotel Jardins & Teatros',
        hospedagem_2: 'Hotel Fasano São Paulo Gastronomia',
      };
    }
    return {
      hospedagem_1: 'Hotel Unique Jardins & Paulista',
      hospedagem_2: 'Tivoli Mofarrej São Paulo Central',
    };
  }

  // Rio de Janeiro
  if (normDest.includes('rio de janeiro')) {
    if (normPref.includes('praia')) {
      return {
        hospedagem_1: 'Copacabana Palace Hotel Beira-Mar',
        hospedagem_2: 'Pousada Ipanema Beach House Pé na Areia',
      };
    }
    return {
      hospedagem_1: 'Hotel Santa Teresa MGallery Centro Histórico',
      hospedagem_2: 'Vila Galé Rio de Janeiro Lapa Central',
    };
  }

  // General fallback by preference keyword
  if (normPref.includes('praia')) {
    return {
      hospedagem_1: `Resort Beira-Mar ${destName || 'Destino'} All Inclusive`,
      hospedagem_2: `Pousada Pé na Areia ${destName || 'Destino'}`,
    };
  }
  if (normPref.includes('natureza')) {
    return {
      hospedagem_1: `Hotel Boutique das Montanhas em ${destName || 'Destino'}`,
      hospedagem_2: `Pousada Charme da Serra com Lareira em ${destName || 'Destino'}`,
    };
  }
  if (normPref.includes('historico')) {
    return {
      hospedagem_1: `Hotel Histórico de Charme no Centro de ${destName || 'Destino'}`,
      hospedagem_2: `Pousada Colonial Barroca em ${destName || 'Destino'}`,
    };
  }
  if (normPref.includes('turistico') || normPref.includes('pontos')) {
    return {
      hospedagem_1: `Hotel ${destName || 'Destino'} Turístico & Spa`,
      hospedagem_2: `Pousada Boutique das Atrações em ${destName || 'Destino'}`,
    };
  }

  return {
    hospedagem_1: `Hotel ${destName || 'Destino'} Premium Central`,
    hospedagem_2: `Pousada Boutique Executiva em ${destName || 'Destino'}`,
  };
}

