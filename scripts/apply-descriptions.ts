import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("Reading AI descriptions from JSON...");

  // Read the merged JSON file
  const jsonPath = "/tmp/ai_descriptions_all.json";
  const jsonContent = fs.readFileSync(jsonPath, "utf-8");
  const AI_DESCRIPTIONS: Record<string, { tagline: string; description: string }> = JSON.parse(jsonContent);

  const slugs = Object.keys(AI_DESCRIPTIONS);
  console.log(`Total descriptions to apply: ${slugs.length}`);

  let updated = 0;
  let notFound = 0;
  const notFoundSlugs: string[] = [];

  for (const slug of slugs) {
    const desc = AI_DESCRIPTIONS[slug];
    if (desc) {
      const result = await prisma.tool.updateMany({
        where: { slug },
        data: {
          tagline: desc.tagline,
          description: desc.description
        }
      });

      if (result.count > 0) {
        updated++;
        if (updated % 50 === 0) {
          console.log(`Progress: ${updated}/${slugs.length}`);
        }
      } else {
        notFound++;
        notFoundSlugs.push(slug);
      }
    }
  }

  console.log(`\nDone!`);
  console.log(`Updated: ${updated}`);
  console.log(`Not found: ${notFound}`);
  if (notFoundSlugs.length > 0 && notFoundSlugs.length <= 20) {
    console.log(`Not found slugs: ${notFoundSlugs.join(", ")}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
