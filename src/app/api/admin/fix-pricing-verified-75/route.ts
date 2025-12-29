import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 75: Backend & Framework Tools pricing
const verifiedPricing: Record<string, object> = {
  "nextjs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://nextjs.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["React framework", "SSR/SSG", "API routes", "App Router"], highlighted: true }],
    notes: "Free and open source from Vercel."
  },
  "nuxt": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://nuxt.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Vue framework", "SSR/SSG", "Auto-imports", "Modules"], highlighted: true }],
    notes: "Free and open source Vue framework."
  },
  "remix": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://remix.run",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["React framework", "Nested routes", "Data loading", "Web standards"], highlighted: true }],
    notes: "Free and open source. Now Shopify."
  },
  "sveltekit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://kit.svelte.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Svelte framework", "SSR/SSG", "File routing", "Adapters"], highlighted: true }],
    notes: "Free and open source Svelte framework."
  },
  "astro": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://astro.build",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Static site builder", "Islands architecture", "Any UI framework"], highlighted: true }],
    notes: "Free and open source."
  },
  "express": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://expressjs.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Node.js framework", "Middleware", "Routing", "Templates"], highlighted: true }],
    notes: "Free and open source. Most popular."
  },
  "fastify": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.fastify.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Fast Node.js", "Plugins", "TypeScript", "JSON Schema"], highlighted: true }],
    notes: "Free and open source. Fast."
  },
  "nestjs": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://nestjs.com",
    tiers: [
      { name: "Free", price: 0, description: "Open source", features: ["TypeScript framework", "Decorators", "Modules", "DI"], highlighted: true },
      { name: "Enterprise", price: 2000, period: "year", description: "Support", features: ["Official support", "Priority issues", "Consulting"] }
    ],
    notes: "Free and open source Node.js framework."
  },
  "hono": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://hono.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Ultra-fast", "Edge native", "TypeScript", "Multi-runtime"], highlighted: true }],
    notes: "Free and open source. Edge-first."
  },
  "elysia": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://elysiajs.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Bun native", "Type-safe", "Fast", "End-to-end typing"], highlighted: true }],
    notes: "Free and open source. Bun-first."
  },
  "django": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.djangoproject.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Python framework", "ORM", "Admin", "Batteries included"], highlighted: true }],
    notes: "Free and open source Python framework."
  },
  "fastapi": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://fastapi.tiangolo.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Python API", "Auto docs", "Type hints", "Async"], highlighted: true }],
    notes: "Free and open source. Modern Python."
  },
  "flask": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://flask.palletsprojects.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Python micro", "Extensible", "Jinja2", "WSGI"], highlighted: true }],
    notes: "Free and open source Python micro."
  },
  "rails": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://rubyonrails.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Ruby framework", "MVC", "ActiveRecord", "Convention"], highlighted: true }],
    notes: "Free and open source Ruby framework."
  },
  "laravel": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://laravel.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["PHP framework", "Eloquent ORM", "Blade", "Artisan"], highlighted: true }],
    notes: "Free and open source PHP framework."
  },
  "spring-boot": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://spring.io/projects/spring-boot",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Java framework", "Auto-config", "Embedded servers", "Production-ready"], highlighted: true }],
    notes: "Free and open source Java framework."
  },
  "gin": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://gin-gonic.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Go framework", "Fast", "Middleware", "JSON validation"], highlighted: true }],
    notes: "Free and open source Go framework."
  },
  "fiber": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://gofiber.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Go framework", "Express-like", "Fast", "Low memory"], highlighted: true }],
    notes: "Free and open source. Express for Go."
  },
  "actix-web": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://actix.rs",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Rust framework", "Type safe", "Fast", "Actor model"], highlighted: true }],
    notes: "Free and open source Rust framework."
  },
  "axum": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://github.com/tokio-rs/axum",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Rust framework", "Tokio-based", "Tower", "Extractors"], highlighted: true }],
    notes: "Free and open source. Tokio team."
  },
  "phoenix": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.phoenixframework.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Elixir framework", "LiveView", "Channels", "Fast"], highlighted: true }],
    notes: "Free and open source Elixir framework."
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let updated = 0;
  let notFound = 0;
  const errors: string[] = [];
  const notFoundList: string[] = [];
  const updatedList: string[] = [];

  for (const [slug, pricing] of Object.entries(verifiedPricing)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: { id: true, name: true }
      });

      if (!tool) {
        notFoundList.push(slug);
        notFound++;
        continue;
      }

      await prisma.tool.update({
        where: { slug },
        data: { pricingDetails: pricing }
      });

      updatedList.push(tool.name);
      updated++;
    } catch (error) {
      errors.push(`${slug}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Pricing batch 75 (Backend & Frameworks) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
