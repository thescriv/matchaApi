const { ObjectId } = require('mongodb')

const { db } = require('../src/helpers/db')

const seedValue = {
  users: [
    {
      _id: new ObjectId('000000000000000000000000'),
      email: 'test@test.com',
      password: 'aaaaaaaa',
      secret_key: 'aaaaaaaa',
      created_at: new Date('2020-02-09T10:30:00.000Z')
    }
  ]
}

async function seedDatabase(askedSeeds) {
  for (const askedSeed of askedSeeds) {
    await db[askedSeed]().insertMany(seedValue[askedSeed])
  }
}

module.exports = { seedDatabase, seedValue }
