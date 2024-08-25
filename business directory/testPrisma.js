// insertTestData.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Example data to insert
  const testUser = await prisma.user.create({
    data: {
      username: "testuser",
      email: "testuser@example.com",
      password: "hashedpassword", // Ensure you use a hashed password in real scenarios
      firstname: "Test",
      lastname: "User",
    },
  });

  console.log("Inserted Test User:", testUser);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
