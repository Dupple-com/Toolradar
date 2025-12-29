import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Batch 51: Dev Tools & IDEs pricing
const verifiedPricing: Record<string, object> = {
  "vs-code": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://code.visualstudio.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Full IDE", "Extensions", "Git integration", "Debugging"], highlighted: true }],
    notes: "Free and open source from Microsoft."
  },
  "intellij-idea": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.jetbrains.com/idea/buy",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["Java/Kotlin", "Maven/Gradle", "Version control", "Basic debugging"] },
      { name: "Ultimate", price: 599, period: "year", description: "First year", features: ["All frameworks", "Database tools", "Profiler", "All JetBrains tools"], highlighted: true }
    ],
    notes: "Ultimate from $149/year after 3 years."
  },
  "pycharm": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.jetbrains.com/pycharm/buy",
    tiers: [
      { name: "Community", price: 0, description: "Free", features: ["Python", "Basic IDE", "Git", "Testing"] },
      { name: "Professional", price: 249, period: "year", description: "First year", features: ["Web frameworks", "Database", "Scientific tools", "Remote dev"], highlighted: true }
    ],
    notes: "Professional from $59/year after 3 years."
  },
  "webstorm": {
    startingPrice: 169, currency: "USD", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.jetbrains.com/webstorm/buy",
    tiers: [{ name: "WebStorm", price: 169, period: "year", description: "First year", features: ["JavaScript/TypeScript", "React/Vue/Angular", "Testing", "Git"], highlighted: true }],
    notes: "From $39/year after 3 years."
  },
  "goland": {
    startingPrice: 249, currency: "USD", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.jetbrains.com/go/buy",
    tiers: [{ name: "GoLand", price: 249, period: "year", description: "First year", features: ["Go development", "Debugging", "Testing", "Database"], highlighted: true }],
    notes: "From $59/year after 3 years."
  },
  "sublime-text": {
    startingPrice: 99, currency: "USD", billingPeriod: "once", hasFreeTrial: true,
    pricingPageUrl: "https://www.sublimetext.com/buy",
    tiers: [{ name: "License", price: 99, period: "once", description: "Perpetual", features: ["All features", "All platforms", "Free updates for 3 years"], highlighted: true }],
    notes: "Free to evaluate. One-time purchase."
  },
  "neovim": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://neovim.io",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Modal editing", "Lua scripting", "LSP support", "Extensible"], highlighted: true }],
    notes: "Free and open source. Fork of Vim."
  },
  "vim": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.vim.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Modal editing", "Customizable", "Lightweight", "Terminal-based"], highlighted: true }],
    notes: "Free and open source. Classic text editor."
  },
  "cursor": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true,
    pricingPageUrl: "https://cursor.com/pricing",
    tiers: [
      { name: "Hobby", price: 0, description: "Free", features: ["2K completions", "50 slow requests", "Basic AI"] },
      { name: "Pro", price: 20, period: "month", description: "Annual $16/mo", features: ["Unlimited completions", "500 fast requests", "GPT-4/Claude"], highlighted: true },
      { name: "Business", price: 40, period: "user/month", description: "Teams", features: ["All Pro", "Admin controls", "SSO", "Priority support"] }
    ],
    notes: "AI-first code editor based on VS Code."
  },
  "zed": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://zed.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["High performance", "Collaboration", "AI assistant", "GPU rendering"], highlighted: true }],
    notes: "Free and open source. Built in Rust."
  },
  "android-studio": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://developer.android.com/studio",
    tiers: [{ name: "Free", price: 0, description: "Free", features: ["Android development", "Emulator", "Debugging", "Layout editor"], highlighted: true }],
    notes: "Official IDE for Android. Free from Google."
  },
  "xcode": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://developer.apple.com/xcode",
    tiers: [{ name: "Free", price: 0, description: "Free", features: ["iOS/macOS dev", "Swift/Obj-C", "Simulator", "Instruments"], highlighted: true }],
    notes: "Free from Apple. Requires Mac."
  },
  "eclipse": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.eclipse.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Java/C++/PHP", "Extensible", "Debugging", "Git"], highlighted: true }],
    notes: "Free and open source. Eclipse Foundation."
  },
  "notepad-plus-plus": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://notepad-plus-plus.org",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Syntax highlighting", "Multi-tab", "Plugins", "Windows only"], highlighted: true }],
    notes: "Free and open source. Windows text editor."
  },
  "nova": {
    startingPrice: 99, currency: "USD", billingPeriod: "once", hasFreeTrial: true, freeTrialDays: 14,
    pricingPageUrl: "https://nova.app",
    tiers: [{ name: "Nova", price: 99, period: "once", description: "One-time", features: ["Mac-native", "Extensions", "Git", "Terminal"], highlighted: true }],
    notes: "One-time purchase. Mac only. By Panic."
  },
  "lapce": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://lapce.dev",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Rust-based", "Fast", "Modal editing", "LSP"], highlighted: true }],
    notes: "Free and open source. Fast editor in Rust."
  },

  // Version Control
  "git": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://git-scm.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Distributed VCS", "Branching", "Merging", "All platforms"], highlighted: true }],
    notes: "Free and open source. Industry standard."
  },
  "gitkraken": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: true, freeTrialDays: 7,
    pricingPageUrl: "https://www.gitkraken.com/pricing",
    tiers: [
      { name: "Free", price: 0, description: "Public repos", features: ["Git GUI", "Visual commits", "Merge conflict editor"] },
      { name: "Pro", price: 4.95, period: "month", description: "Annual", features: ["All Free", "Private repos", "Multiple profiles"], highlighted: true },
      { name: "Teams", price: 8.95, period: "user/month", description: "Teams", features: ["All Pro", "Team features", "Priority support"] }
    ],
    notes: "Git GUI client. Free for public repos."
  },
  "sourcetree": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://www.sourcetreeapp.com",
    tiers: [{ name: "Free", price: 0, description: "Free", features: ["Git/Mercurial GUI", "Visual branches", "Mac/Windows"], highlighted: true }],
    notes: "Free from Atlassian."
  },
  "github-desktop": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://desktop.github.com",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["GitHub integration", "Visual commits", "Branch management"], highlighted: true }],
    notes: "Free and open source from GitHub."
  },
  "fork-git": {
    startingPrice: 49.99, currency: "USD", billingPeriod: "once", hasFreeTrial: true,
    pricingPageUrl: "https://git-fork.com",
    tiers: [{ name: "License", price: 49.99, period: "once", description: "One-time", features: ["Git GUI", "Interactive rebase", "Merge conflicts", "Mac/Windows"], highlighted: true }],
    notes: "Free to evaluate. One-time purchase."
  },
  "tower": {
    startingPrice: 69, currency: "USD", billingPeriod: "year", hasFreeTrial: true, freeTrialDays: 30,
    pricingPageUrl: "https://www.git-tower.com/pricing",
    tiers: [
      { name: "Basic", price: 69, period: "year", description: "1 device", features: ["Git GUI", "Drag & drop", "Undo feature"] },
      { name: "Pro", price: 99, period: "year", description: "3 devices", features: ["All Basic", "Team features", "Priority support"], highlighted: true }
    ],
    notes: "Professional Git client."
  },
  "lazygit": {
    startingPrice: 0, currency: "USD", billingPeriod: "month", hasFreeTrial: false,
    pricingPageUrl: "https://github.com/jesseduffield/lazygit",
    tiers: [{ name: "Free", price: 0, description: "Open source", features: ["Terminal UI", "Keyboard shortcuts", "Interactive rebase"], highlighted: true }],
    notes: "Free and open source. Terminal-based."
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
    message: "Pricing batch 51 (Dev Tools & IDEs) applied",
    updated,
    notFound,
    notFoundList,
    updatedList,
    errors,
    total: Object.keys(verifiedPricing).length
  });
}
