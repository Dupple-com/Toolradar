const fs = require('fs');
const path = require('path');

const tools = JSON.parse(fs.readFileSync('/tmp/all_tools.json', 'utf-8'));

// Generate the seed route
const routeContent = `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// All tools extracted from pricing and TLDR files (${tools.length} total)
const allTools: Array<{slug: string; name: string; tagline?: string; startingPrice?: number; notes?: string}> = ${JSON.stringify(tools, null, 2)};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Get or create default category
  let defaultCategory = await prisma.category.findFirst({
    where: { slug: "productivity" }
  });

  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: {
        name: "Productivity",
        slug: "productivity",
        icon: "zap",
        description: "Personal and team productivity apps"
      }
    });
  }

  for (const tool of allTools) {
    try {
      // Check if already exists
      const existing = await prisma.tool.findUnique({
        where: { slug: tool.slug }
      });

      if (existing) {
        // Update tagline if tool has one and existing doesn't
        if (tool.tagline && (!existing.tagline || existing.tagline.includes("Software tool"))) {
          await prisma.tool.update({
            where: { slug: tool.slug },
            data: { tagline: tool.tagline }
          });
          updated++;
        } else {
          skipped++;
        }
        continue;
      }

      // Determine pricing type
      let pricing = "freemium";
      if (tool.startingPrice === 0) pricing = "freemium";
      else if (tool.startingPrice && tool.startingPrice > 0) pricing = "paid";

      // Create tool
      const newTool = await prisma.tool.create({
        data: {
          name: tool.name,
          slug: tool.slug,
          tagline: tool.tagline || \`\${tool.name} - Software tool\`,
          description: tool.notes || \`\${tool.name} is a productivity and business software tool.\`,
          pricing,
          status: "published",
          upvotes: Math.floor(Math.random() * 200) + 10,
          weeklyUpvotes: Math.floor(Math.random() * 50) + 5,
          communityScore: 0,
        }
      });

      // Link to default category
      await prisma.categoryTool.create({
        data: {
          toolId: newTool.id,
          categoryId: defaultCategory.id
        }
      });

      created++;
    } catch (error) {
      errors.push(\`\${tool.slug}: \${error instanceof Error ? error.message : "Unknown"}\`);
    }
  }

  return NextResponse.json({
    success: true,
    message: \`Seed completed: \${created} created, \${updated} updated, \${skipped} skipped\`,
    created,
    updated,
    skipped,
    total: allTools.length,
    errors: errors.slice(0, 20)
  });
}
`;

const outputDir = path.join(__dirname, '../src/app/api/admin/seed-all-tools');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'route.ts'), routeContent);
console.log('Created seed route with', tools.length, 'tools');
