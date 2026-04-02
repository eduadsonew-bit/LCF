import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin users with PINs
  const devUser = await prisma.adminUser.upsert({
    where: { pin: 'LCF2026DEV' },
    update: {},
    create: {
      name: 'Desarrollador LCF',
      pin: 'LCF2026DEV',
      role: 'dev',
    },
  });

  console.log('Created dev user:', devUser.name, '- Role:', devUser.role);

  const adminUser = await prisma.adminUser.upsert({
    where: { pin: 'LCF2026ADMIN' },
    update: {},
    create: {
      name: 'Administrador LCF',
      pin: 'LCF2026ADMIN',
      role: 'admin',
    },
  });

  console.log('Created admin user:', adminUser.name, '- Role:', adminUser.role);

  // Create tournaments
  const tournaments = await Promise.all([
    prisma.tournament.upsert({
      where: { id: 'tournament-1' },
      update: {},
      create: {
        id: 'tournament-1',
        name: 'Torneo Apertura 2024',
        description: 'Torneo de apertura de la temporada 2024. Participan los mejores equipos de la liga.',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-06-30'),
        status: 'active',
        category: 'Adulto',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
      },
    }),
    prisma.tournament.upsert({
      where: { id: 'tournament-2' },
      update: {},
      create: {
        id: 'tournament-2',
        name: 'Liga Juvenil 2024',
        description: 'Liga para categorías juveniles Sub-17 y Sub-20.',
        startDate: new Date('2024-04-15'),
        endDate: new Date('2024-08-30'),
        status: 'active',
        category: 'Juvenil',
        image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=400&fit=crop',
      },
    }),
    prisma.tournament.upsert({
      where: { id: 'tournament-3' },
      update: {},
      create: {
        id: 'tournament-3',
        name: 'Copa Infantil 2024',
        description: 'Torneo de fútbol para categorías infantiles Sub-10 y Sub-12.',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-07-15'),
        status: 'upcoming',
        category: 'Infantil',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop',
      },
    }),
  ]);

  console.log('Created tournaments:', tournaments.length);

  // Create matches
  const matches = await Promise.all([
    prisma.match.create({
      data: {
        tournamentId: 'tournament-1',
        homeTeam: 'Águilas FC',
        awayTeam: 'Tigres United',
        homeScore: 2,
        awayScore: 1,
        matchDate: new Date('2024-03-15T15:00:00'),
        venue: 'Estadio Municipal',
        status: 'finished',
      },
    }),
    prisma.match.create({
      data: {
        tournamentId: 'tournament-1',
        homeTeam: 'Leones SC',
        awayTeam: 'Águilas FC',
        matchDate: new Date('2024-03-22T17:00:00'),
        venue: 'Estadio Municipal',
        status: 'scheduled',
      },
    }),
    prisma.match.create({
      data: {
        tournamentId: 'tournament-1',
        homeTeam: 'Tigres United',
        awayTeam: 'Pumas del Norte',
        matchDate: new Date('2024-03-23T16:00:00'),
        venue: 'Cancha Central',
        status: 'scheduled',
      },
    }),
    prisma.match.create({
      data: {
        tournamentId: 'tournament-1',
        homeTeam: 'Águilas FC',
        awayTeam: 'Pumas del Norte',
        homeScore: 3,
        awayScore: 2,
        matchDate: new Date('2024-03-10T15:00:00'),
        venue: 'Estadio Municipal',
        status: 'finished',
      },
    }),
    prisma.match.create({
      data: {
        tournamentId: 'tournament-2',
        homeTeam: 'Juvenil A',
        awayTeam: 'Juvenil B',
        matchDate: new Date('2024-04-20T10:00:00'),
        venue: 'Cancha Auxiliar 1',
        status: 'scheduled',
      },
    }),
  ]);

  console.log('Created matches:', matches.length);

  // Create news
  const news = await Promise.all([
    prisma.news.create({
      data: {
        title: '¡Comienza el Torneo Apertura 2024!',
        content: 'Con gran entusiasmo damos inicio al Torneo Apertura 2024. Esta temporada tendremos la participación de 12 equipos que lucharán por el campeonato. Las emociones comienzan este fin de semana con 6 partidos programados.',
        summary: 'La nueva temporada de fútbol arranca con todo.',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=400&fit=crop',
        author: 'Redacción LCF',
        published: true,
        featured: true,
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log('Created news:', news.length);

  // Create events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Ceremonia de Apertura',
        description: 'Ceremonia oficial de apertura del Torneo Apertura 2024. Habrá presentación de equipos y show musical.',
        date: new Date('2024-03-01T18:00:00'),
        location: 'Estadio Municipal',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        eventType: 'ceremonia',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Final del Torneo Apertura',
        description: 'Gran final del Torneo Apertura 2024. Los dos mejores equipos se enfrentarán por el campeonato.',
        date: new Date('2024-06-30T16:00:00'),
        location: 'Estadio Municipal',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=400&fit=crop',
        eventType: 'partido',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Premiación Mejor Jugador',
        description: 'Ceremonia de premiación al mejor jugador de la temporada. Entrega de trofeos y reconocimientos.',
        date: new Date('2024-07-15T19:00:00'),
        location: 'Centro de Eventos LCF',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=400&fit=crop',
        eventType: 'ceremonia',
      },
    }),
  ]);

  console.log('Created events:', events.length);

  // Create sponsors
  const sponsors = await Promise.all([
    prisma.sponsor.create({
      data: {
        name: 'Gatorade',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Gatorade_logo.svg/200px-Gatorade_logo.svg.png',
        website: 'https://www.gatorade.com',
        tier: 'gold',
        active: true,
        order: 1,
      },
    }),
    prisma.sponsor.create({
      data: {
        name: 'Nike',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png',
        website: 'https://www.nike.com',
        tier: 'gold',
        active: true,
        order: 2,
      },
    }),
    prisma.sponsor.create({
      data: {
        name: 'Adidas',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/200px-Adidas_Logo.svg.png',
        website: 'https://www.adidas.com',
        tier: 'gold',
        active: true,
        order: 3,
      },
    }),
    prisma.sponsor.create({
      data: {
        name: 'Coca-Cola',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png',
        website: 'https://www.coca-cola.com',
        tier: 'silver',
        active: true,
        order: 4,
      },
    }),
    prisma.sponsor.create({
      data: {
        name: 'Pepsi',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Pepsi_logo_2008-2014.svg/200px-Pepsi_logo_2008-2014.svg.png',
        website: 'https://www.pepsi.com',
        tier: 'silver',
        active: true,
        order: 5,
      },
    }),
    prisma.sponsor.create({
      data: {
        name: 'Powerade',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Powerade_logo.svg/200px-Powerade_logo.svg.png',
        website: 'https://www.powerade.com',
        tier: 'bronze',
        active: true,
        order: 6,
      },
    }),
  ]);

  console.log('Created sponsors:', sponsors.length);

  // Create carousel slides
  const carouselSlides = await Promise.all([
    prisma.carouselSlide.create({
      data: {
        title: 'Torneo Apertura 2024',
        subtitle: 'La emoción del fútbol comienza aquí',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop',
        link: '#torneos',
        linkText: 'Ver Torneos',
        order: 1,
        active: true,
      },
    }),
    prisma.carouselSlide.create({
      data: {
        title: 'Inscripciones Abiertas',
        subtitle: 'Inscribe tu equipo para la Liga Juvenil 2024',
        image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&h=600&fit=crop',
        link: '#contacto',
        linkText: 'Contáctanos',
        order: 2,
        active: true,
      },
    }),
    prisma.carouselSlide.create({
      data: {
        title: 'Únete a LCF',
        subtitle: 'Forma parte de nuestra comunidad futbolera',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=600&fit=crop',
        link: '#nosotros',
        linkText: 'Conocer Más',
        order: 3,
        active: true,
      },
    }),
  ]);

  console.log('Created carousel slides:', carouselSlides.length);

  // Create info cards
  const infoCards = await Promise.all([
    prisma.infoCard.create({
      data: {
        title: 'Torneos Activos',
        description: 'Participa en nuestros torneos de fútbol y demuestra tu talento en la cancha.',
        icon: 'trophy',
        link: '#torneos',
        linkText: 'Ver torneos',
        color: 'green',
        order: 1,
        active: true,
      },
    }),
    prisma.infoCard.create({
      data: {
        title: 'Programación',
        description: 'Consulta los próximos partidos y no te pierdas ningún juego de tu equipo.',
        icon: 'calendar',
        link: '#programacion',
        linkText: 'Ver programación',
        color: 'blue',
        order: 2,
        active: true,
      },
    }),
    prisma.infoCard.create({
      data: {
        title: 'Trámites en Línea',
        description: 'Realiza tus trámites de inscripción y documentos de forma rápida y sencilla.',
        icon: 'file-text',
        link: '#tramites',
        linkText: 'Iniciar trámite',
        color: 'orange',
        order: 3,
        active: true,
      },
    }),
  ]);

  console.log('Created info cards:', infoCards.length);

  // Create gallery items
  const galleryItems = await Promise.all([
    prisma.galleryItem.create({
      data: {
        title: 'Partido Inaugural',
        description: 'Emociones del partido inaugural del Torneo Apertura',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
        category: 'partido',
        order: 1,
        active: true,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: 'Ceremonia de Premiación',
        description: 'Momentos de la ceremonia de premiación',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&h=400&fit=crop',
        category: 'ceremonia',
        order: 2,
        active: true,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: 'Fútbol Juvenil',
        description: 'Jóvenes talentos en acción',
        image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&h=400&fit=crop',
        category: 'torneo',
        order: 3,
        active: true,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: 'Estadio Lleno',
        description: 'Nuestro estadio repleto de aficionados',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop',
        category: 'partido',
        order: 4,
        active: true,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: 'Entrenamiento',
        description: 'Equipos entrenando para el torneo',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop',
        category: 'entrenamiento',
        order: 5,
        active: true,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: 'Celebración',
        description: 'Celebración del equipo campeón',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=400&fit=crop',
        category: 'ceremonia',
        order: 6,
        active: true,
      },
    }),
  ]);

  console.log('Created gallery items:', galleryItems.length);

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
