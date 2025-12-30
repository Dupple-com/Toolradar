import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// URL corrections for 163 tools
const urlCorrections: Record<string, string> = {
  "1password-business": "https://1password.com/business",
  "aws-amplify": "https://aws.amazon.com/amplify",
  "aws-codecommit": "https://aws.amazon.com/codecommit",
  "adobe-creative-cloud": "https://www.adobe.com/creativecloud.html",
  "adobe-illustrator": "https://www.adobe.com/products/illustrator.html",
  "adobe-photoshop": "https://www.adobe.com/products/photoshop.html",
  "adobe-sign": "https://www.adobe.com/sign.html",
  "airtable-forms": "https://airtable.com/product/forms",
  "clickup-docs": "https://clickup.com/features/docs",
  "cloudflare-pages": "https://pages.cloudflare.com",
  "dropbox-paper": "https://www.dropbox.com/paper",
  "dropbox-sign": "https://sign.dropbox.com",
  "fathom-analytics": "https://usefathom.com",
  "fly-io": "https://fly.io",
  "github-pages": "https://pages.github.com",
  "google-cloud-source": "https://cloud.google.com/source-repositories",
  "google-workspace": "https://workspace.google.com",
  "hubspot-marketing": "https://www.hubspot.com/products/marketing",
  "hubspot-service": "https://www.hubspot.com/products/service",
  "linkedin-learning": "https://www.linkedin.com/learning",
  "microsoft-365": "https://www.microsoft.com/microsoft-365",
  "mongodb-atlas": "https://www.mongodb.com/atlas",
  "notion-ai": "https://www.notion.so/product/ai",
  "notion-calendar": "https://www.notion.so/product/calendar",
  "postman-api": "https://www.postman.com",
  "webflow-cms": "https://webflow.com/cms",
  "wordpress-com": "https://wordpress.com",
  "dall-e": "https://openai.com/dall-e-3",
  "firebase": "https://firebase.google.com",
  "heroku": "https://www.heroku.com",
  "codepen": "https://codepen.io",
  "codeberg": "https://codeberg.org",
  "astro": "https://astro.build",
  "artillery": "https://www.artillery.io",
  "apiary": "https://apiary.io",
  "apollo": "https://www.apollo.io",
  "apollo-graphql": "https://www.apollographql.com",
  "bannerbear": "https://www.bannerbear.com",
  "bardeen": "https://www.bardeen.ai",
  "basin": "https://usebasin.com",
  "better-stack": "https://betterstack.com",
  "bill-com": "https://www.bill.com",
  "bitrix24": "https://www.bitrix24.com",
  "bluehost": "https://www.bluehost.com",
  "bookstack": "https://www.bookstackapp.com",
  "brevo": "https://www.brevo.com",
  "builtwith": "https://builtwith.com",
  "buzzsumo": "https://buzzsumo.com",
  "camtasia": "https://www.techsmith.com/video-editor.html",
  "constant-contact": "https://www.constantcontact.com",
  "confluence": "https://www.atlassian.com/software/confluence",
  "continue-dev": "https://continue.dev",
  "coursera": "https://www.coursera.org",
  "document360": "https://document360.com",
  "drip": "https://www.drip.com",
  "formstack": "https://www.formstack.com",
  "getform": "https://getform.io",
  "getresponse": "https://www.getresponse.com",
  "gravitee": "https://www.gravitee.io",
  "harbor": "https://goharbor.io",
  "helpjuice": "https://helpjuice.com",
  "heyflow": "https://heyflow.com",
  "hostinger": "https://www.hostinger.com",
  "influxdb": "https://www.influxdata.com",
  "instantly": "https://instantly.ai",
  "invideo": "https://invideo.io",
  "involve-me": "https://www.involve.me",
  "jetbrains": "https://www.jetbrains.com",
  "kahoot": "https://kahoot.com",
  "kinsta": "https://kinsta.com",
  "kong": "https://konghq.com",
  "lemon-squeezy": "https://www.lemonsqueezy.com",
  "lighthouse": "https://developer.chrome.com/docs/lighthouse",
  "liveagent": "https://www.liveagent.com",
  "livechat": "https://www.livechat.com",
  "livekit": "https://livekit.io",
  "liveshare": "https://visualstudio.microsoft.com/services/live-share",
  "locust": "https://locust.io",
  "lucidchart": "https://www.lucidchart.com",
  "mailerlite": "https://www.mailerlite.com",
  "memberful": "https://memberful.com",
  "mentimeter": "https://www.mentimeter.com",
  "mockapi": "https://mockapi.io",
  "mockoon": "https://mockoon.com",
  "moosend": "https://moosend.com",
  "nifty": "https://niftypm.com",
  "nomad": "https://www.nomadproject.io",
  "nuclino": "https://www.nuclino.com",
  "obs-studio": "https://obsproject.com",
  "octotree": "https://www.octotree.io",
  "omnisend": "https://www.omnisend.com",
  "otter": "https://otter.ai",
  "outline": "https://www.getoutline.com",
  "pantheon": "https://pantheon.io",
  "patreon": "https://www.patreon.com",
  "perforce": "https://www.perforce.com",
  "pika": "https://pika.art",
  "piktochart": "https://piktochart.com",
  "pixlr": "https://pixlr.com",
  "placid": "https://placid.app",
  "plaid": "https://plaid.com",
  "plastic-scm": "https://www.plasticscm.com",
  "prezi": "https://prezi.com",
  "quay": "https://quay.io",
  "readwise": "https://readwise.io",
  "refined-github": "https://github.com/refined-github/refined-github",
  "reform": "https://www.reform.app",
  "remotion": "https://www.remotion.dev",
  "restream": "https://restream.io",
  "runway": "https://runwayml.com",
  "rytr": "https://rytr.me",
  "sage": "https://www.sage.com",
  "screencastify": "https://www.screencastify.com",
  "screenflow": "https://www.telestream.net/screenflow",
  "se-ranking": "https://seranking.com",
  "sendible": "https://www.sendible.com",
  "similarweb": "https://www.similarweb.com",
  "siteground": "https://www.siteground.com",
  "skillshare": "https://www.skillshare.com",
  "slab": "https://slab.com",
  "smartlead": "https://www.smartlead.ai",
  "smartsheet": "https://www.smartsheet.com",
  "snagit": "https://www.techsmith.com/screen-capture.html",
  "snappa": "https://snappa.com",
  "sourcegraph": "https://sourcegraph.com",
  "sourcehut": "https://sr.ht",
  "storychief": "https://storychief.io",
  "streamyard": "https://streamyard.com",
  "strikingly": "https://www.strikingly.com",
  "super": "https://super.so",
  "surfer": "https://surferseo.com",
  "sync": "https://www.sync.com",
  "teamwork": "https://www.teamwork.com",
  "testim": "https://www.testim.io",
  "things": "https://culturedcode.com/things",
  "tripetto": "https://tripetto.com",
  "twilio": "https://www.twilio.com",
  "udemy": "https://www.udemy.com",
  "volusion": "https://www.volusion.com",
  "waalaxy": "https://www.waalaxy.com",
  "wappalyzer": "https://www.wappalyzer.com",
  "web-vitals": "https://web.dev/vitals",
  "weebly": "https://www.weebly.com",
  "whimsical": "https://whimsical.com",
  "wiki-js": "https://js.wiki",
  "woodpecker": "https://woodpecker.co",
  "wordpress": "https://wordpress.org",
  "workday": "https://www.workday.com",
  "wpengine": "https://wpengine.com",
  "writesonic": "https://writesonic.com",
  "wufoo": "https://www.wufoo.com",
  "algolia": "https://www.algolia.com",
  "activecampaign": "https://www.activecampaign.com",
  "agorapulse": "https://www.agorapulse.com",
  "aweber": "https://www.aweber.com",
  "caprover": "https://caprover.com",
  "cleanshot": "https://cleanshot.com",
  "cognito-forms": "https://www.cognitoforms.com",
  "dokku": "https://dokku.com",
  "dreamhost": "https://www.dreamhost.com",
  "feathery": "https://www.feathery.io",
  "fireflies": "https://fireflies.ai",
  "flodesk": "https://flodesk.com"
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const dryRun = searchParams.get("dry") === "true";

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    updated: 0,
    notFound: 0,
    errors: [] as string[],
  };

  for (const [slug, correctUrl] of Object.entries(urlCorrections)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        select: { id: true, website: true }
      });

      if (!tool) {
        results.notFound++;
        continue;
      }

      if (!dryRun) {
        await prisma.tool.update({
          where: { slug },
          data: { website: correctUrl }
        });
      }

      results.updated++;
    } catch (error) {
      results.errors.push(`${slug}: ${error instanceof Error ? error.message : "Unknown"}`);
    }
  }

  return NextResponse.json({
    success: true,
    dryRun,
    message: dryRun ? "Dry run completed" : "URLs corrected",
    summary: {
      updated: results.updated,
      notFound: results.notFound,
      total: Object.keys(urlCorrections).length
    },
    errors: results.errors
  });
}
