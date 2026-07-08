// Optional helper: creates one manager and two members so you can log in immediately.
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Project.deleteMany({});

  const manager = await User.create({
    name: 'Priya Manager',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager',
  });

  const member1 = await User.create({
    name: 'Kirojan S',
    email: 'member1@example.com',
    password: 'password123',
    role: 'member',
  });

  const member2 = await User.create({
    name: 'Arun T',
    email: 'member2@example.com',
    password: 'password123',
    role: 'member',
  });

  await Project.create({
    name: 'Client A',
    description: 'Client A engagement work',
    members: [member1._id, member2._id],
    createdBy: manager._id,
  });

  await Project.create({
    name: 'Internal Tooling',
    description: 'Internal dashboards and automation',
    members: [member1._id],
    createdBy: manager._id,
  });

  console.log('Seed complete. Login with:');
  console.log('  manager@example.com / password123 (manager)');
  console.log('  member1@example.com / password123 (member)');
  console.log('  member2@example.com / password123 (member)');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
