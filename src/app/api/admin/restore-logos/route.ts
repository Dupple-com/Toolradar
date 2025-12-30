import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Helper: Use Google's favicon service for consistent square logos (128px)
const getLogo = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// Custom high-quality logos for major tools
const customLogos: Record<string, string> = {
  "notion.so":
    "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  "slack.com":
    "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
  "figma.com":
    "https://cdn.sanity.io/images/599r6htc/regionalized/46a76c802176eb17b04e12108571f3e0f2abad73-1080x1080.png",
  "github.com": "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  "linear.app": "https://linear.app/static/apple-touch-icon.png",
  "stripe.com":
    "https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg",
  "vercel.com":
    "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
  "airtable.com": "https://airtable.com/images/favicon/baymax/apple-touch-icon.png",
  "asana.com":
    "https://d1gwm4cf8hecp4.cloudfront.net/images/favicons/apple-touch-icon.png",
  "atlassian.com":
    "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon.png",
  "trello.com": "https://trello.com/assets/apple-touch-icon.png",
  "miro.com": "https://miro.com/static/favicons/apple-touch-icon.png",
  "loom.com": "https://cdn.loom.com/assets/favicons/apple-touch-icon.png",
  "canva.com": "https://static.canva.com/static/images/iOS-app-icon-180x180.png",
  "hubspot.com":
    "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
  "salesforce.com":
    "https://www.salesforce.com/content/dam/sfdc-docs/www/logos/logo-salesforce.png",
  "intercom.com":
    "https://static.intercomassets.com/assets/favicon-7f72e7d9f6a0d26c4c83b13e5fefc8ba71eb53b8c5eba0b3b5fe5f921e2df3d6.png",
  "mailchimp.com":
    "https://eep.io/images/yzco4xsimv0y/KZD0BZjgSCigJYOzNKSjq/7d6dded8b01bf6b03e7dc0e1e91e30b5/mailchimp-freddie-icon-wink.png",
  "dropbox.com":
    "https://cfl.dropboxstatic.com/static/images/logo_catalog/dropbox_logo_glyph_m1.png",
  "1password.com": "https://1password.com/apple-touch-icon.png",
  "calendly.com": "https://assets.calendly.com/assets/apple-touch-icon.png",
  "monday.com": "https://cdn.monday.com/images/logos/monday_logo_icon.png",
  "clickup.com": "https://clickup.com/apple-touch-icon.png",
  "zapier.com":
    "https://cdn.zapier.com/ssr/4bf98e82e2f9f97e8746e5c5e0d5f9a2fa33c03f/_next/static/images/apple-touch-icon-180-c2e26dd7a6.png",
  "webflow.com":
    "https://assets-global.website-files.com/5d3e265ac89f6a3e64292efc/5d5a431a9b94a727a7a9a3e8_favicon.png",
  "framer.com": "https://framerusercontent.com/images/3gTbUnrg5iRTLGLCrEb6pZ7gI.png",
  "openai.com": "https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp",
  "anthropic.com": "https://www.anthropic.com/images/icons/apple-touch-icon.png",
  "supabase.com": "https://supabase.com/favicon/apple-touch-icon.png",
  "planetscale.com": "https://planetscale.com/favicon/apple-touch-icon.png",
  "neon.tech": "https://neon.tech/favicon/apple-touch-icon.png",
  "railway.app": "https://railway.app/apple-touch-icon.png",
  "render.com": "https://render.com/apple-touch-icon.png",
  "fly.io": "https://fly.io/static/images/brand/brandmark.png",
  "cloudflare.com": "https://www.cloudflare.com/favicon.ico",
  "retool.com": "https://retool.com/apple-touch-icon.png",
  "n8n.io": "https://n8n.io/favicon/apple-touch-icon.png",
  "make.com": "https://www.make.com/apple-touch-icon.png",
  "resend.com": "https://resend.com/static/apple-touch-icon.png",
  "plausible.io": "https://plausible.io/apple-touch-icon.png",
  "posthog.com": "https://posthog.com/images/favicon/apple-touch-icon.png",
  "descript.com": "https://www.descript.com/apple-touch-icon.png",
  "tally.so": "https://tally.so/apple-touch-icon.png",
  "typeform.com": "https://www.typeform.com/apple-touch-icon.png",
  "raycast.com": "https://raycast.com/apple-touch-icon.png",
  "arc.net": "https://arc.net/apple-touch-icon.png",
  "obsidian.md": "https://obsidian.md/images/obsidian-logo-512.png",
  "perplexity.ai": "https://www.perplexity.ai/apple-touch-icon.png",
  "grammarly.com":
    "https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/apple-touch-icon.png",
  "elevenlabs.io": "https://elevenlabs.io/apple-touch-icon.png",
  "prisma.io": "https://www.prisma.io/apple-touch-icon.png",
  "clerk.com": "https://clerk.com/apple-touch-icon.png",
  "auth0.com":
    "https://cdn.auth0.com/website/assets/pages/press/img/auth0-badge-7bfe51b174.png",
  "twilio.com": "https://www.twilio.com/favicon.ico",
  "codepen.io": "https://cpwebassets.codepen.io/assets/favicon/apple-touch-icon-5ae1a0698dcc2402e9712f7d01ed509a57814f994c660df9f7a952f3060571a.png",
  "firebase.google.com": "https://www.gstatic.com/devrel-devsite/prod/v1a2d2d725c48303ffd65eb7122e57032dbf9bb148227658cacdfddf0dcae3a00/firebase/images/touchicon-180.png",
  "adobe.com": "https://www.adobe.com/favicon.ico",
  "aws.amazon.com": "https://a0.awsstatic.com/libra-css/images/site/touch-icon-ipad-144-precomposed.png",
  "azure.microsoft.com": "https://azure.microsoft.com/favicon.ico",
  "cloud.google.com": "https://www.gstatic.com/devrel-devsite/prod/v1a2d2d725c48303ffd65eb7122e57032dbf9bb148227658cacdfddf0dcae3a00/cloud/images/touchicon-180.png",
  "digitalocean.com": "https://www.digitalocean.com/apple-touch-icon.png",
  "heroku.com": "https://www.herokucdn.com/favicon.ico",
  "netlify.com": "https://www.netlify.com/apple-touch-icon.png",
  "docker.com": "https://www.docker.com/wp-content/uploads/2023/04/cropped-Docker-favicon-180x180.png",
  "gitlab.com": "https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png",
  "bitbucket.org": "https://wac-cdn.atlassian.com/assets/img/favicons/bitbucket/apple-touch-icon.png",
  "jira.atlassian.com": "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon.png",
  "confluence.atlassian.com": "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon.png",
  "zendesk.com": "https://www.zendesk.com/apple-touch-icon.png",
  "freshdesk.com": "https://www.freshworks.com/apple-touch-icon.png",
  "coda.io": "https://coda.io/apple-touch-icon.png",
  "basecamp.com": "https://basecamp.com/favicon.ico",
  "todoist.com": "https://todoist.com/static/icons/apple-touch-icon.png",
  "evernote.com": "https://evernote.com/apple-touch-icon.png",
  "roamresearch.com": "https://roamresearch.com/favicon.ico",
  "logseq.com": "https://logseq.com/apple-touch-icon.png",
  "craft.do": "https://www.craft.do/apple-touch-icon.png",
  "bear.app": "https://bear.app/apple-touch-icon.png",
  "things3.com": "https://culturedcode.com/things/favicon-180.png",
  "omnifocus.com": "https://www.omnigroup.com/assets/img/icons/apple-touch-icon-180x180.png",
  "wrike.com": "https://www.wrike.com/apple-touch-icon.png",
  "smartsheet.com": "https://www.smartsheet.com/sites/all/themes/smartsheet_theme/favicon/apple-touch-icon.png",
  "teamwork.com": "https://www.teamwork.com/apple-touch-icon.png",
  "baserow.io": "https://baserow.io/apple-touch-icon.png",
  "nocodb.com": "https://nocodb.com/favicon.ico",
  "appflowy.io": "https://appflowy.io/apple-touch-icon.png",
  "anytype.io": "https://anytype.io/apple-touch-icon.png",
  "capacities.io": "https://capacities.io/apple-touch-icon.png",
  "mem.ai": "https://mem.ai/apple-touch-icon.png",
  "reflect.app": "https://reflect.app/apple-touch-icon.png",
  "heptabase.com": "https://heptabase.com/favicon.ico",
  "scrintal.com": "https://www.scrintal.com/apple-touch-icon.png",
  "tana.inc": "https://tana.inc/apple-touch-icon.png",
  "affine.pro": "https://affine.pro/apple-touch-icon.png",
  "saga.so": "https://saga.so/apple-touch-icon.png",
};

function getLogoForWebsite(website: string): string {
  try {
    const url = new URL(website);
    const domain = url.hostname.replace("www.", "");

    // Check for custom logo
    if (customLogos[domain]) {
      return customLogos[domain];
    }

    // Check variations
    for (const [key, logo] of Object.entries(customLogos)) {
      if (domain.includes(key.replace("www.", "")) || key.includes(domain)) {
        return logo;
      }
    }

    // Fall back to Google favicon service
    return getLogo(domain);
  } catch {
    return getLogo(website);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const dryRun = searchParams.get("dry") === "true";

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tools = await prisma.tool.findMany({
    where: { status: "published" },
    select: { id: true, slug: true, website: true, logo: true },
  });

  const results = {
    updated: 0,
    skipped: 0,
    errors: [] as string[],
  };

  for (const tool of tools) {
    try {
      const newLogo = getLogoForWebsite(tool.website);

      // Skip if logo already set correctly
      if (tool.logo && tool.logo === newLogo) {
        results.skipped++;
        continue;
      }

      if (!dryRun) {
        await prisma.tool.update({
          where: { id: tool.id },
          data: { logo: newLogo },
        });
      }

      results.updated++;
    } catch (error) {
      results.errors.push(
        `${tool.slug}: ${error instanceof Error ? error.message : "Unknown"}`
      );
    }
  }

  return NextResponse.json({
    success: true,
    dryRun,
    message: dryRun ? "Dry run completed" : "Logos restored",
    summary: {
      updated: results.updated,
      skipped: results.skipped,
      total: tools.length,
    },
    errors: results.errors.slice(0, 20),
  });
}
