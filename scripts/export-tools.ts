import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    select: { slug: true, name: true, website: true },
    orderBy: { name: "asc" },
  });

  console.log(`Found ${tools.length} published tools:\n`);

  // Output as JSON for easy processing
  console.log(JSON.stringify(tools, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
