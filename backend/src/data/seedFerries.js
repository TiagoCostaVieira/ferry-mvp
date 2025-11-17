const mongoose = require('mongoose');
const Ferry = require('../models/Ferry');
require('dotenv').config();

const ferriesData = [
  {
    name: "Ferry São Luís 1",
    description: "Embarcação moderna com capacidade para 40 veículos",
    status: "active",
    currentStatus: "boarding",
    capacity: 40,
    currentOccupancy: 37,
    route: {
      from: "São Luís",
      to: "Alcântara",
      duration: 60,
      distance: 30
    },
    schedule: [
      { time: "06:00", day: "all" },
      { time: "08:00", day: "all" },
      { time: "10:00", day: "all" },
      { time: "12:00", day: "all" },
      { time: "14:00", day: "all" },
      { time: "16:00", day: "all" },
      { time: "18:00", day: "all" }
    ],
    prices: {
      motorcycle: 25.00,
      car: 45.00,
      suv: 65.00,
      truck: 120.00
    },
    location: {
      latitude: -2.5307,
      longitude: -44.3068
    },
    features: ["wifi", "air_conditioning", "food_service", "accessible"]
  },
  {
    name: "Ferry Alcântara 1",
    description: "Embarcação confortável para a rota Alcântara-São Luís",
    status: "active",
    currentStatus: "departed",
    capacity: 40,
    currentOccupancy: 40,
    route: {
      from: "Alcântara",
      to: "São Luís",
      duration: 60,
      distance: 30
    },
    schedule: [
      { time: "07:00", day: "all" },
      { time: "09:00", day: "all" },
      { time: "11:00", day: "all" },
      { time: "13:00", day: "all" },
      { time: "15:00", day: "all" },
      { time: "17:00", day: "all" },
      { time: "19:00", day: "all" }
    ],
    prices: {
      motorcycle: 25.00,
      car: 45.00,
      suv: 65.00,
      truck: 120.00
    },
    location: {
      latitude: -2.4089,
      longitude: -44.4153
    },
    features: ["wifi", "air_conditioning", "pet_friendly"]
  },
  {
    name: "Ferry Cujupe 1",
    description: "Serviço regular para a comunidade de Cujupe",
    status: "active",
    currentStatus: "waiting",
    capacity: 40,
    currentOccupancy: 10,
    route: {
      from: "Cujupe",
      to: "São Luís",
      duration: 45,
      distance: 25
    },
    schedule: [
      { time: "08:30", day: "all" },
      { time: "10:30", day: "all" },
      { time: "12:30", day: "all" },
      { time: "14:30", day: "all" },
      { time: "16:30", day: "all" }
    ],
    prices: {
      motorcycle: 20.00,
      car: 35.00,
      suv: 50.00,
      truck: 100.00
    },
    location: {
      latitude: -2.5500,
      longitude: -44.2500
    },
    features: ["air_conditioning"]
  },
  {
    name: "Ferry São Luís 2",
    description: "Nova embarcação com tecnologia de ponta",
    status: "active",
    currentStatus: "boarding",
    capacity: 50,
    currentOccupancy: 40,
    route: {
      from: "São Luís",
      to: "Alcântara",
      duration: 55,
      distance: 30
    },
    schedule: [
      { time: "06:30", day: "all" },
      { time: "08:30", day: "all" },
      { time: "10:30", day: "all" },
      { time: "12:30", day: "all" },
      { time: "14:30", day: "all" },
      { time: "16:30", day: "all" },
      { time: "18:30", day: "all" }
    ],
    prices: {
      motorcycle: 25.00,
      car: 45.00,
      suv: 65.00,
      truck: 120.00
    },
    location: {
      latitude: -2.5310,
      longitude: -44.3070
    },
    features: ["wifi", "air_conditioning", "food_service", "premium_seats", "pet_friendly"]
  }
];

const seedFerries = async () => {
  try {
    // Clear existing ferries
    await Ferry.deleteMany();
    console.log('🗑️  Ferries anteriores removidos');

    // Create new ferries
    await Ferry.create(ferriesData);
    console.log('✅ Ferries de teste criados com sucesso!');
    
    // Show created ferries
    const ferries = await Ferry.find();
    console.log(`📊 Total de ferries: ${ferries.length}`);
    
    ferries.forEach(ferry => {
      console.log(`🚢 ${ferry.name} - ${ferry.formattedRoute}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar ferries:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ferry-app')
    .then(() => {
      console.log('📦 Conectado ao MongoDB para seed');
      seedFerries();
    })
    .catch(err => {
      console.error('❌ Erro ao conectar MongoDB:', err);
      process.exit(1);
    });
}

module.exports = seedFerries;