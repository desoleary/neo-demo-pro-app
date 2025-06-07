import { v4 as uuidv4 } from 'uuid';
import { transfers } from './data';

// Generate random date within the last 30 days
function randomDate() {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 30);
  
  return new Date(
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime())
  ).toISOString();
}

// Generate random amount between min and max
function randomAmount(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export async function seed() {
  // Clear existing data
  transfers.length = 0;

  // Generate 100 random transfers
  for (let i = 0; i < 100; i++) {
    const fromAccountId = String(Math.floor(Math.random() * 10) + 1);
    let toAccountId: string;
    
    // Make sure toAccountId is different from fromAccountId
    do {
      toAccountId = String(Math.floor(Math.random() * 10) + 1);
    } while (toAccountId === fromAccountId);
    
    const amount = randomAmount(10, 1000);
    const now = new Date().toISOString();
    
    transfers.push({
      id: uuidv4(),
      fromAccountId,
      toAccountId,
      amount,
      status: Math.random() > 0.2 ? 'COMPLETED' : 'PENDING',
      createdAt: randomDate(),
      updatedAt: now,
    });
  }

  console.log(`Seeded ${transfers.length} transfers.`);
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed().catch((err) => {
    console.error('Error seeding transfers:', err);
    process.exit(1);
  });
}
