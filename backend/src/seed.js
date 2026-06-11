/**
 * Seed script — Laxmi Cycles Store
 * Populates 100+ cycles: Hero(30), Vesco(25), Sun Bride(25), Afro(20)
 * Run: node src/seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('⚠️ Warning: Could not set custom DNS servers:', err.message);
}

const mongoose = require('mongoose');
const Cycle = require('./models/Cycle');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('❌  MONGODB_URI not set in .env');
  process.exit(1);
}

/* ─── Real bicycle image URLs from Unsplash ───────────────────────────── */
const BIKE_IMAGES = [
  'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=800&q=80',
  'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&q=80',
  'https://images.unsplash.com/photo-1533561052604-c3beb6d55b8d?w=800&q=80',
  'https://images.unsplash.com/photo-1605557626697-2e87166d88f9?w=800&q=80',
  'https://images.unsplash.com/photo-1618762044398-ec1e7e048bbd?w=800&q=80',
  'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80',
  'https://images.unsplash.com/photo-1487800940032-1cf211187aea?w=800&q=80',
  'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80',
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
  'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&q=80',
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
  'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80',
  'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
  'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80',
  'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
  'https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?w=800&q=80',
  'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=80',
  'https://images.unsplash.com/photo-1530143584546-02191bc84eb5?w=800&q=80',
  'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
  'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80',
];

let imgIdx = 0;
const nextImg = () => {
  const url = BIKE_IMAGES[imgIdx % BIKE_IMAGES.length];
  imgIdx++;
  return [{ url, publicId: `seed_${imgIdx}` }];
};

const SIZES = ['16 inch', '18 inch', '20 inch', '24 inch', '26 inch', '30 inch'];
const COLORS = ['Black', 'Red', 'Blue', 'White', 'Green', 'Orange', 'Silver', 'Yellow'];
const GEARS = ['1', '6', '7', '18', '21'];
const FRAMES = ['Alloy', 'Steel', 'Carbon', 'Chromoly'];
const BRAKES = ['Disc', 'V-Brake', 'Caliper', 'Hydraulic Disc'];
const CATEGORIES = ['Mountain', 'Road', 'Kids', 'Sports', 'Hybrid', 'City'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rPrice = (min, max) => Math.round((Math.random() * (max - min) + min) / 100) * 100;

/* ─────────────────────────────────────────────────────────────────────── */
/* HERO CYCLES — 30 entries                                                */
/* ─────────────────────────────────────────────────────────────────────── */
const heroModels = [
  // 16 inch (5)
  { name: 'Hero Sprint 16', size: '16 inch', color: 'Red', category: 'Kids', price: 3200 },
  { name: 'Hero Buddy 16', size: '16 inch', color: 'Blue', category: 'Kids', price: 2800 },
  { name: 'Hero Flash 16', size: '16 inch', color: 'Yellow', category: 'Kids', price: 3500 },
  { name: 'Hero Zoom 16', size: '16 inch', color: 'Green', category: 'Kids', price: 2950 },
  { name: 'Hero Ranger Junior 16', size: '16 inch', color: 'Orange', category: 'Kids', price: 3100 },
  // 18 inch (5)
  { name: 'Hero Blaze 18', size: '18 inch', color: 'Black', category: 'Kids', price: 3800 },
  { name: 'Hero Turbo 18', size: '18 inch', color: 'Red', category: 'Kids', price: 4200 },
  { name: 'Hero City Rider 18', size: '18 inch', color: 'White', category: 'City', price: 4500 },
  { name: 'Hero Cyclone 18', size: '18 inch', color: 'Blue', category: 'Kids', price: 3600 },
  { name: 'Hero Star 18', size: '18 inch', color: 'Silver', category: 'Kids', price: 4000 },
  // 20 inch (5)
  { name: 'Hero Hawk 20', size: '20 inch', color: 'Black', category: 'Mountain', price: 5500 },
  { name: 'Hero Roadster 20', size: '20 inch', color: 'Red', category: 'Road', price: 6000 },
  { name: 'Hero Urban 20', size: '20 inch', color: 'White', category: 'City', price: 5800 },
  { name: 'Hero Trail 20', size: '20 inch', color: 'Green', category: 'Mountain', price: 5200 },
  { name: 'Hero Cruise 20', size: '20 inch', color: 'Blue', category: 'Hybrid', price: 5700 },
  // 24 inch (5)
  { name: 'Hero Phoenix 24', size: '24 inch', color: 'Orange', category: 'Sports', price: 7500 },
  { name: 'Hero Glide 24', size: '24 inch', color: 'Black', category: 'Hybrid', price: 8000 },
  { name: 'Hero Vanguard 24', size: '24 inch', color: 'Silver', category: 'Mountain', price: 8500 },
  { name: 'Hero Vector 24', size: '24 inch', color: 'Red', category: 'Road', price: 7800 },
  { name: 'Hero Stride 24', size: '24 inch', color: 'Blue', category: 'City', price: 7200 },
  // 26 inch (5)
  { name: 'Hero Osprey 26', size: '26 inch', color: 'Black', category: 'Mountain', price: 10500 },
  { name: 'Hero Velocity 26', size: '26 inch', color: 'Red', category: 'Sports', price: 11000 },
  { name: 'Hero Summit 26', size: '26 inch', color: 'Green', category: 'Mountain', price: 9800 },
  { name: 'Hero Cruiser 26', size: '26 inch', color: 'White', category: 'City', price: 9500 },
  { name: 'Hero XT Pro 26', size: '26 inch', color: 'Blue', category: 'Road', price: 12000 },
  // 30 inch (5)
  { name: 'Hero Titan 30', size: '30 inch', color: 'Black', category: 'Road', price: 14500 },
  { name: 'Hero Enduro 30', size: '30 inch', color: 'Silver', category: 'Mountain', price: 16000 },
  { name: 'Hero Prestige 30', size: '30 inch', color: 'Red', category: 'Sports', price: 15000 },
  { name: 'Hero Elite Pro 30', size: '30 inch', color: 'Blue', category: 'Road', price: 17500 },
  { name: 'Hero Apex 30', size: '30 inch', color: 'White', category: 'Hybrid', price: 13500 },
];

/* ─────────────────────────────────────────────────────────────────────── */
/* VESCO CYCLES — 25 entries                                               */
/* ─────────────────────────────────────────────────────────────────────── */
const vescoModels = [
  // 16 inch (4)
  { name: 'Vesco Mini 16', size: '16 inch', color: 'Pink', category: 'Kids', price: 2700 },
  { name: 'Vesco Jr Sport 16', size: '16 inch', color: 'Blue', category: 'Kids', price: 3000 },
  { name: 'Vesco Spark 16', size: '16 inch', color: 'Yellow', category: 'Kids', price: 2850 },
  { name: 'Vesco Ace Junior 16', size: '16 inch', color: 'Red', category: 'Kids', price: 3100 },
  // 18 inch (4)
  { name: 'Vesco Swift 18', size: '18 inch', color: 'Green', category: 'Kids', price: 3900 },
  { name: 'Vesco Dash 18', size: '18 inch', color: 'Orange', category: 'Kids', price: 4100 },
  { name: 'Vesco Metro 18', size: '18 inch', color: 'Black', category: 'City', price: 4400 },
  { name: 'Vesco Trail Jr 18', size: '18 inch', color: 'Blue', category: 'Mountain', price: 4200 },
  // 20 inch (5)
  { name: 'Vesco Echo 20', size: '20 inch', color: 'White', category: 'Road', price: 5500 },
  { name: 'Vesco Ridge 20', size: '20 inch', color: 'Red', category: 'Mountain', price: 5800 },
  { name: 'Vesco Urban Pro 20', size: '20 inch', color: 'Black', category: 'City', price: 6000 },
  { name: 'Vesco Wave 20', size: '20 inch', color: 'Blue', category: 'Hybrid', price: 5200 },
  { name: 'Vesco Glider 20', size: '20 inch', color: 'Silver', category: 'Road', price: 5900 },
  // 24 inch (4)
  { name: 'Vesco Ranger 24', size: '24 inch', color: 'Green', category: 'Mountain', price: 7800 },
  { name: 'Vesco Sprint Pro 24', size: '24 inch', color: 'Black', category: 'Sports', price: 8500 },
  { name: 'Vesco Commuter 24', size: '24 inch', color: 'White', category: 'City', price: 7200 },
  { name: 'Vesco Aero 24', size: '24 inch', color: 'Red', category: 'Road', price: 8000 },
  // 26 inch (4)
  { name: 'Vesco Highlander 26', size: '26 inch', color: 'Black', category: 'Mountain', price: 10000 },
  { name: 'Vesco Boulevard 26', size: '26 inch', color: 'White', category: 'City', price: 9200 },
  { name: 'Vesco Carbon Race 26', size: '26 inch', color: 'Red', category: 'Road', price: 13000 },
  { name: 'Vesco Extreme 26', size: '26 inch', color: 'Blue', category: 'Sports', price: 11500 },
  // 30 inch (4)
  { name: 'Vesco Legend 30', size: '30 inch', color: 'Black', category: 'Road', price: 15000 },
  { name: 'Vesco Pro Tour 30', size: '30 inch', color: 'Red', category: 'Sports', price: 17000 },
  { name: 'Vesco Endurance 30', size: '30 inch', color: 'Blue', category: 'Mountain', price: 16500 },
  { name: 'Vesco Master 30', size: '30 inch', color: 'Silver', category: 'Hybrid', price: 14000 },
];

/* ─────────────────────────────────────────────────────────────────────── */
/* SUN BRIDE CYCLES — 25 entries                                           */
/* ─────────────────────────────────────────────────────────────────────── */
const sunBrideModels = [
  // 16 inch (4)
  { name: 'Sun Bride Petal 16', size: '16 inch', color: 'Pink', category: 'Kids', price: 2600 },
  { name: 'Sun Bride Sunny 16', size: '16 inch', color: 'Yellow', category: 'Kids', price: 2900 },
  { name: 'Sun Bride Joy 16', size: '16 inch', color: 'Purple', category: 'Kids', price: 3000 },
  { name: 'Sun Bride Star Jr 16', size: '16 inch', color: 'Blue', category: 'Kids', price: 2750 },
  // 18 inch (4)
  { name: 'Sun Bride Breeze 18', size: '18 inch', color: 'White', category: 'Kids', price: 3700 },
  { name: 'Sun Bride Bloom 18', size: '18 inch', color: 'Pink', category: 'Kids', price: 3800 },
  { name: 'Sun Bride Metro Jr 18', size: '18 inch', color: 'Black', category: 'City', price: 4200 },
  { name: 'Sun Bride Flash 18', size: '18 inch', color: 'Red', category: 'Kids', price: 4000 },
  // 20 inch (5)
  { name: 'Sun Bride Lumen 20', size: '20 inch', color: 'Silver', category: 'Hybrid', price: 5400 },
  { name: 'Sun Bride Nimbus 20', size: '20 inch', color: 'Blue', category: 'City', price: 5600 },
  { name: 'Sun Bride Trail 20', size: '20 inch', color: 'Green', category: 'Mountain', price: 5800 },
  { name: 'Sun Bride Classic 20', size: '20 inch', color: 'White', category: 'Road', price: 5200 },
  { name: 'Sun Bride Swift 20', size: '20 inch', color: 'Red', category: 'Sports', price: 6100 },
  // 24 inch (4)
  { name: 'Sun Bride Horizon 24', size: '24 inch', color: 'Blue', category: 'Road', price: 7600 },
  { name: 'Sun Bride Venture 24', size: '24 inch', color: 'Black', category: 'Mountain', price: 8200 },
  { name: 'Sun Bride Urban 24', size: '24 inch', color: 'White', category: 'City', price: 7400 },
  { name: 'Sun Bride Racer 24', size: '24 inch', color: 'Red', category: 'Sports', price: 8800 },
  // 26 inch (4)
  { name: 'Sun Bride Voyager 26', size: '26 inch', color: 'Green', category: 'Mountain', price: 10200 },
  { name: 'Sun Bride Glide 26', size: '26 inch', color: 'Silver', category: 'City', price: 9600 },
  { name: 'Sun Bride Century 26', size: '26 inch', color: 'Black', category: 'Road', price: 11800 },
  { name: 'Sun Bride Trail King 26', size: '26 inch', color: 'Blue', category: 'Mountain', price: 10900 },
  // 30 inch (4)
  { name: 'Sun Bride Royale 30', size: '30 inch', color: 'White', category: 'Road', price: 15500 },
  { name: 'Sun Bride Summit 30', size: '30 inch', color: 'Black', category: 'Mountain', price: 17200 },
  { name: 'Sun Bride Pro Series 30', size: '30 inch', color: 'Red', category: 'Sports', price: 16000 },
  { name: 'Sun Bride Elegance 30', size: '30 inch', color: 'Silver', category: 'Hybrid', price: 13800 },
];

/* ─────────────────────────────────────────────────────────────────────── */
/* AFRO CYCLES — 20 entries                                                */
/* ─────────────────────────────────────────────────────────────────────── */
const afroModels = [
  // 16 inch (3)
  { name: 'Afro Cub 16', size: '16 inch', color: 'Orange', category: 'Kids', price: 2900 },
  { name: 'Afro Scout 16', size: '16 inch', color: 'Green', category: 'Kids', price: 3200 },
  { name: 'Afro Tiny Pro 16', size: '16 inch', color: 'Blue', category: 'Kids', price: 3400 },
  // 18 inch (3)
  { name: 'Afro Thunder 18', size: '18 inch', color: 'Black', category: 'Kids', price: 4300 },
  { name: 'Afro Safari 18', size: '18 inch', color: 'Yellow', category: 'Kids', price: 4100 },
  { name: 'Afro Hustle 18', size: '18 inch', color: 'Red', category: 'City', price: 4500 },
  // 20 inch (3)
  { name: 'Afro Blazer 20', size: '20 inch', color: 'White', category: 'Hybrid', price: 5700 },
  { name: 'Afro Gravel 20', size: '20 inch', color: 'Black', category: 'Mountain', price: 6200 },
  { name: 'Afro Street 20', size: '20 inch', color: 'Green', category: 'City', price: 5500 },
  // 24 inch (4)
  { name: 'Afro Revolt 24', size: '24 inch', color: 'Red', category: 'Sports', price: 8400 },
  { name: 'Afro Navigator 24', size: '24 inch', color: 'Blue', category: 'Mountain', price: 8100 },
  { name: 'Afro Urban X 24', size: '24 inch', color: 'Black', category: 'City', price: 7700 },
  { name: 'Afro Raider 24', size: '24 inch', color: 'Orange', category: 'Mountain', price: 8600 },
  // 26 inch (4)
  { name: 'Afro Force 26', size: '26 inch', color: 'Black', category: 'Mountain', price: 10800 },
  { name: 'Afro Groove 26', size: '26 inch', color: 'Green', category: 'Hybrid', price: 9800 },
  { name: 'Afro Speed King 26', size: '26 inch', color: 'Red', category: 'Road', price: 12200 },
  { name: 'Afro Wilderness 26', size: '26 inch', color: 'Blue', category: 'Mountain', price: 11000 },
  // 30 inch (3)
  { name: 'Afro Conqueror 30', size: '30 inch', color: 'Black', category: 'Mountain', price: 16800 },
  { name: 'Afro Race Star 30', size: '30 inch', color: 'Red', category: 'Road', price: 18000 },
  { name: 'Afro Expedition 30', size: '30 inch', color: 'Blue', category: 'Hybrid', price: 15200 },
];

/* ─── Build full documents ────────────────────────────────────────────── */
function buildDocs(brand, models) {
  return models.map((m) => ({
    name: m.name,
    brand,
    category: m.category,
    size: m.size,
    color: m.color,
    price: m.price,
    description: `${m.name} by ${brand} — a premium ${m.size} ${m.category.toLowerCase()} cycle available in ${m.color}. Designed for performance and durability, this cycle is perfect for daily riding and adventure.`,
    specifications: {
      wheelSize: m.size,
      frameSize: m.size,
      frameMaterial: pick(FRAMES),
      gears: pick(GEARS),
      brakeType: pick(BRAKES),
      color: m.color,
      weight: `${(Math.random() * 5 + 8).toFixed(1)} kg`,
      suspension: m.category === 'Mountain' ? 'Front Suspension' : 'None',
    },
    images: nextImg(),
    isAvailable: true,
    isFeatured: Math.random() < 0.15,
    tags: [brand.toLowerCase(), m.category.toLowerCase(), m.size.replace(' ', '-')],
  }));
}

const ALL_CYCLES = [
  ...buildDocs('Hero', heroModels),
  ...buildDocs('Vesco', vescoModels),
  ...buildDocs('Sun Bride', sunBrideModels),
  ...buildDocs('Afro', afroModels),
];

/* ─── Main ────────────────────────────────────────────────────────────── */
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅  MongoDB connected');

  // Seed Users & Admins
  await User.deleteMany({});
  
  await User.create({
    name: 'Laxmi Admin',
    email: 'admin@laxmicycles.com',
    password: 'adminpassword123',
    role: 'admin',
  });
  console.log('🌱  Seeded admin: admin@laxmicycles.com / adminpassword123');

  await User.create({
    name: 'John Doe',
    email: 'user@laxmicycles.com',
    password: 'userpassword123',
    role: 'user',
  });
  console.log('🌱  Seeded user: user@laxmicycles.com / userpassword123');

  // Delete only cycles belonging to the 4 brands so existing data is preserved
  const result = await Cycle.deleteMany({ brand: { $in: ['Hero', 'Vesco', 'Sun Bride', 'Afro', 'Atlas', 'Avon', 'BSA', 'Firefox', 'Hercules', 'Montra'] } });
  console.log(`🗑   Removed ${result.deletedCount} old cycle documents`);

  await Cycle.insertMany(ALL_CYCLES, { ordered: false });
  console.log(`🌱  Seeded ${ALL_CYCLES.length} cycles (Hero:${heroModels.length}, Vesco:${vescoModels.length}, Sun Bride:${sunBrideModels.length}, Afro:${afroModels.length})`);

  await mongoose.disconnect();
  console.log('🎉  Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed error:', err.message);
  process.exit(1);
});
