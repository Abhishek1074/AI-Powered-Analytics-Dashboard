  const dns = require('dns');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const Sale = require('./models/Sale');

const products = [
  { product: 'Aurora Laptop', category: 'Electronics', price: 950 },
  { product: 'Pulse Earbuds', category: 'Electronics', price: 120 },
  { product: 'Nimbus Phone', category: 'Electronics', price: 680 },
  { product: 'Trail Backpack', category: 'Outdoor', price: 85 },
  { product: 'Summit Tent', category: 'Outdoor', price: 240 },
  { product: 'ErgoChair Pro', category: 'Furniture', price: 310 },
  { product: 'Oak Desk', category: 'Furniture', price: 420 },
  { product: 'Brew Master', category: 'Home', price: 95 },
];
const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
const channels = ['Online', 'Retail', 'Partner'];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Sale.deleteMany({});

  const docs = [];
  const now = new Date();
  // 12 months of data with mild growth plus noise
  for (let m = 11; m >= 0; m--) {
    const growth = 1 + (11 - m) * 0.03;
    const count = Math.round(rand(80, 120) * growth);
    for (let i = 0; i < count; i++) {
      const p = pick(products);
      const units = rand(1, 6);
      const date = new Date(now.getFullYear(), now.getMonth() - m, rand(1, 28), rand(8, 20));
      docs.push({
        date,
        product: p.product,
        category: p.category,
        region: pick(regions),
        channel: pick(channels),
        units,
        revenue: Math.round(units * p.price * (0.9 + Math.random() * 0.2)),
      });
    }
  }

  await Sale.insertMany(docs);
  console.log(`Seeded ${docs.length} sales records.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
