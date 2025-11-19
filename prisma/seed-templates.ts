import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    name: 'Morning Routine',
    nameFi: 'Aamurutiini',
    description: 'Start your day right with this morning routine',
    descriptionFi: 'Aloita päiväsi oikein tällä aamurutiinilla',
    category: 'Home',
    icon: '☀️',
    isSystem: true,
    tasks: [
      { title: 'Wake up', titleFi: 'Herää', category: 'Home', priority: 'MEDIUM', points: 5, order: 1 },
      { title: 'Make bed', titleFi: 'Petaa sänky', category: 'Home', priority: 'LOW', points: 10, order: 2 },
      { title: 'Brush teeth', titleFi: 'Pese hampaat', category: 'Health', priority: 'HIGH', points: 10, order: 3 },
      { title: 'Eat breakfast', titleFi: 'Syö aamupala', category: 'Health', priority: 'HIGH', points: 15, order: 4 },
      { title: 'Get dressed', titleFi: 'Pukeudu', category: 'Home', priority: 'MEDIUM', points: 10, order: 5 },
    ],
  },
  {
    name: 'Weekly Cleaning',
    nameFi: 'Viikkosiivous',
    description: 'Keep your home clean with this weekly routine',
    descriptionFi: 'Pidä kotisi siistinä tällä viikkorutiinilla',
    category: 'Home',
    icon: '🧹',
    isSystem: true,
    tasks: [
      { title: 'Vacuum all rooms', titleFi: 'Imuroi kaikki huoneet', category: 'Home', priority: 'MEDIUM', points: 30, order: 1 },
      { title: 'Mop floors', titleFi: 'Pese lattiat', category: 'Home', priority: 'MEDIUM', points: 25, order: 2, dependsOnOrder: 1 },
      { title: 'Clean bathrooms', titleFi: 'Siivoa kylpyhuoneet', category: 'Home', priority: 'HIGH', points: 35, order: 3 },
      { title: 'Change bed sheets', titleFi: 'Vaihda lakanat', category: 'Home', priority: 'MEDIUM', points: 20, order: 4 },
      { title: 'Take out trash', titleFi: 'Vie roskat', category: 'Home', priority: 'HIGH', points: 15, order: 5 },
      { title: 'Dust surfaces', titleFi: 'Pyyhi pölyt', category: 'Home', priority: 'LOW', points: 15, order: 6 },
    ],
  },
  {
    name: 'School Morning',
    nameFi: 'Kouluaamu',
    description: 'Get ready for school efficiently',
    descriptionFi: 'Valmistaudu kouluun tehokkaasti',
    category: 'School',
    icon: '🎒',
    isSystem: true,
    tasks: [
      { title: 'Wake up on time', titleFi: 'Herää ajoissa', category: 'School', priority: 'URGENT', points: 10, order: 1 },
      { title: 'Eat breakfast', titleFi: 'Syö aamupala', category: 'Health', priority: 'HIGH', points: 15, order: 2 },
      { title: 'Pack school bag', titleFi: 'Pakkaa koululaukku', category: 'School', priority: 'URGENT', points: 20, order: 3 },
      { title: 'Check homework', titleFi: 'Tarkista läksyt', category: 'School', priority: 'HIGH', points: 25, order: 4 },
      { title: 'Get dressed', titleFi: 'Pukeudu', category: 'School', priority: 'MEDIUM', points: 10, order: 5 },
      { title: 'Leave on time', titleFi: 'Lähde ajoissa', category: 'School', priority: 'URGENT', points: 15, order: 6, dependsOnOrder: 5 },
    ],
  },
  {
    name: 'Travel Preparation',
    nameFi: 'Matkavalmistelut',
    description: 'Prepare for your trip without forgetting anything',
    descriptionFi: 'Valmistaudu matkalle unohtamatta mitään',
    category: 'Other',
    icon: '✈️',
    isSystem: true,
    tasks: [
      { title: 'Check passport validity', titleFi: 'Tarkista passin voimassaolo', category: 'Other', priority: 'URGENT', points: 20, order: 1 },
      { title: 'Book accommodation', titleFi: 'Varaa majoitus', category: 'Other', priority: 'HIGH', points: 30, order: 2 },
      { title: 'Pack clothes', titleFi: 'Pakkaa vaatteet', category: 'Other', priority: 'MEDIUM', points: 25, order: 3 },
      { title: 'Pack toiletries', titleFi: 'Pakkaa hygieniatuotteet', category: 'Health', priority: 'MEDIUM', points: 15, order: 4 },
      { title: 'Charge devices', titleFi: 'Lataa laitteet', category: 'Other', priority: 'MEDIUM', points: 10, order: 5 },
      { title: 'Print tickets', titleFi: 'Tulosta liput', category: 'Other', priority: 'HIGH', points: 15, order: 6 },
      { title: 'Arrange pet care', titleFi: 'Järjestä lemmikkien hoito', category: 'Home', priority: 'HIGH', points: 20, order: 7 },
      { title: 'Stop mail delivery', titleFi: 'Keskeytä postin toimitus', category: 'Home', priority: 'LOW', points: 10, order: 8 },
    ],
  },
  {
    name: 'Weekly Meal Prep',
    nameFi: 'Viikon ruoanvalmistus',
    description: 'Prepare meals for the week ahead',
    descriptionFi: 'Valmista ateriat viikoksi eteenpäin',
    category: 'Home',
    icon: '🍳',
    isSystem: true,
    tasks: [
      { title: 'Plan weekly menu', titleFi: 'Suunnittele viikon ruokalista', category: 'Home', priority: 'MEDIUM', points: 20, order: 1 },
      { title: 'Make shopping list', titleFi: 'Tee ostoslista', category: 'Shopping', priority: 'MEDIUM', points: 15, order: 2, dependsOnOrder: 1 },
      { title: 'Buy groceries', titleFi: 'Osta ruokaostokset', category: 'Shopping', priority: 'HIGH', points: 30, order: 3, dependsOnOrder: 2 },
      { title: 'Prep vegetables', titleFi: 'Valmistele vihannekset', category: 'Home', priority: 'MEDIUM', points: 25, order: 4, dependsOnOrder: 3 },
      { title: 'Cook main dishes', titleFi: 'Valmista pääruoat', category: 'Home', priority: 'MEDIUM', points: 40, order: 5, dependsOnOrder: 4 },
      { title: 'Portion and store', titleFi: 'Annostele ja säilytä', category: 'Home', priority: 'MEDIUM', points: 20, order: 6, dependsOnOrder: 5 },
    ],
  },
  {
    name: 'Sports Training Day',
    nameFi: 'Urheiluharjoituspäivä',
    description: 'Prepare for your training session',
    descriptionFi: 'Valmistaudu harjoituksiin',
    category: 'Hobbies',
    icon: '⚽',
    isSystem: true,
    tasks: [
      { title: 'Wash sports uniform', titleFi: 'Pese urheiluvarusteet', category: 'Home', priority: 'HIGH', points: 15, order: 1 },
      { title: 'Pack sports bag', titleFi: 'Pakkaa urheilukassi', category: 'Hobbies', priority: 'HIGH', points: 20, order: 2, dependsOnOrder: 1 },
      { title: 'Prepare water bottle', titleFi: 'Valmistele juomapullo', category: 'Health', priority: 'MEDIUM', points: 10, order: 3 },
      { title: 'Eat pre-training snack', titleFi: 'Syö ennen harjoituksia', category: 'Health', priority: 'MEDIUM', points: 15, order: 4 },
      { title: 'Arrive 15 min early', titleFi: 'Saavu 15 min etuajassa', category: 'Hobbies', priority: 'HIGH', points: 20, order: 5 },
    ],
  },
  {
    name: 'Homework Routine',
    nameFi: 'Läksyrutiini',
    description: 'Complete homework efficiently',
    descriptionFi: 'Tee läksyt tehokkaasti',
    category: 'School',
    icon: '📚',
    isSystem: true,
    tasks: [
      { title: 'Check assignment list', titleFi: 'Tarkista tehtävälista', category: 'School', priority: 'HIGH', points: 10, order: 1 },
      { title: 'Gather materials', titleFi: 'Kerää tarvikkeet', category: 'School', priority: 'MEDIUM', points: 10, order: 2 },
      { title: 'Complete math homework', titleFi: 'Tee matematiikan läksyt', category: 'School', priority: 'HIGH', points: 30, order: 3 },
      { title: 'Complete reading', titleFi: 'Tee lukutehtävät', category: 'School', priority: 'HIGH', points: 25, order: 4 },
      { title: 'Review notes', titleFi: 'Kertaa muistiinpanot', category: 'School', priority: 'MEDIUM', points: 20, order: 5 },
      { title: 'Pack bag for tomorrow', titleFi: 'Pakkaa laukku huomiseksi', category: 'School', priority: 'HIGH', points: 15, order: 6 },
    ],
  },
  {
    name: 'Bedtime Routine',
    nameFi: 'Iltarutiini',
    description: 'Wind down for a good night sleep',
    descriptionFi: 'Rauhoitu hyvää yöunta varten',
    category: 'Health',
    icon: '🌙',
    isSystem: true,
    tasks: [
      { title: 'Brush teeth', titleFi: 'Pese hampaat', category: 'Health', priority: 'HIGH', points: 10, order: 1 },
      { title: 'Take shower', titleFi: 'Käy suihkussa', category: 'Health', priority: 'MEDIUM', points: 15, order: 2 },
      { title: 'Prepare clothes for tomorrow', titleFi: 'Valmistele vaatteet huomiseksi', category: 'Home', priority: 'LOW', points: 10, order: 3 },
      { title: 'Set alarm', titleFi: 'Aseta herätyskello', category: 'Home', priority: 'HIGH', points: 5, order: 4 },
      { title: 'Read for 15 minutes', titleFi: 'Lue 15 minuuttia', category: 'Hobbies', priority: 'LOW', points: 15, order: 5 },
      { title: 'Lights out by 10 PM', titleFi: 'Valot pois klo 22', category: 'Health', priority: 'MEDIUM', points: 10, order: 6 },
    ],
  },
];

async function main() {
  console.log('Seeding templates...');

  for (const template of templates) {
    const { tasks, ...templateData } = template;
    
    const createdTemplate = await prisma.template.create({
      data: {
        ...templateData,
        templateTasks: {
          create: tasks,
        },
      },
    });

    console.log(`Created template: ${createdTemplate.name} (${createdTemplate.nameFi})`);
  }

  console.log('✅ Templates seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
