import { prisma } from "../src/lib/prisma";

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.log("Usage: npx tsx scripts/delete-post.ts <slug>");
    process.exit(1);
  }

  const post = await prisma.blogPost.delete({
    where: { slug }
  });
  console.log("Deleted:", post.id, post.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
