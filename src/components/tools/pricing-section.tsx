import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: number | string;
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  cta?: string;
  ctaLink?: string;
}

interface PricingDetails {
  startingPrice?: number;
  currency?: string;
  billingPeriod?: string;
  hasFreeTrial?: boolean;
  freeTrialDays?: number;
  tiers?: PricingTier[];
  pricingPageUrl?: string;
}

interface PricingSectionProps {
  pricing: string; // free, freemium, paid
  pricingDetails?: PricingDetails | null;
  toolName: string;
  website?: string;
}

export function PricingSection({ pricing, pricingDetails, toolName, website }: PricingSectionProps) {
  const hasTiers = pricingDetails?.tiers && pricingDetails.tiers.length > 0;
  const currency = pricingDetails?.currency || "USD";
  const currencySymbol = currency === "EUR" ? "€" : "$";

  // Fallback display when no detailed pricing
  if (!hasTiers) {
    return (
      <section className="bg-card rounded-xl border p-6">
        <h2 className="font-semibold text-lg mb-4">Pricing</h2>
        <div className="flex items-center justify-between">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              pricing === "free" ? "bg-green-100 text-green-700" :
              pricing === "freemium" ? "bg-blue-100 text-blue-700" :
              "bg-purple-100 text-purple-700"
            }`}>
              {pricing === "free" ? "Free" :
               pricing === "freemium" ? "Freemium" :
               "Paid"}
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              {pricing === "free" && `${toolName} is completely free to use.`}
              {pricing === "freemium" && `${toolName} offers a free plan with paid upgrades.`}
              {pricing === "paid" && `${toolName} requires a paid subscription.`}
            </p>
            {pricingDetails?.startingPrice !== undefined && pricingDetails.startingPrice > 0 && (
              <p className="text-lg font-semibold mt-2">
                Starting at {currencySymbol}{pricingDetails.startingPrice}
                <span className="text-sm font-normal text-muted-foreground">
                  /{pricingDetails.billingPeriod || "month"}
                </span>
              </p>
            )}
            {pricingDetails?.hasFreeTrial && (
              <p className="text-sm text-green-600 mt-1">
                {pricingDetails.freeTrialDays ? `${pricingDetails.freeTrialDays}-day` : ""} free trial available
              </p>
            )}
          </div>
          {website && (
            <a
              href={pricingDetails?.pricingPageUrl || `${website}/pricing`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View pricing <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </section>
    );
  }

  // Detailed pricing tiers
  return (
    <section className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg">Pricing Plans</h2>
        {pricingDetails?.hasFreeTrial && (
          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
            {pricingDetails.freeTrialDays ? `${pricingDetails.freeTrialDays}-day` : ""} free trial
          </span>
        )}
      </div>

      <div className={`grid gap-4 ${
        pricingDetails.tiers!.length === 2 ? "grid-cols-1 md:grid-cols-2" :
        pricingDetails.tiers!.length >= 3 ? "grid-cols-1 md:grid-cols-3" :
        "grid-cols-1"
      }`}>
        {pricingDetails.tiers!.map((tier, index) => (
          <div
            key={index}
            className={`rounded-lg border p-5 ${
              tier.highlighted ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
            }`}
          >
            {tier.highlighted && (
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <h3 className="font-semibold text-lg mt-1">{tier.name}</h3>

            <div className="mt-2">
              {typeof tier.price === "number" ? (
                <p className="text-3xl font-bold">
                  {tier.price === 0 ? "Free" : `${currencySymbol}${tier.price}`}
                  {tier.price > 0 && tier.period && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /{tier.period}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-2xl font-bold">{tier.price}</p>
              )}
            </div>

            {tier.description && (
              <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
            )}

            {tier.features && tier.features.length > 0 && (
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {website && (
        <div className="mt-6 text-center">
          <a
            href={pricingDetails?.pricingPageUrl || `${website}/pricing`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium"
          >
            View full pricing <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </section>
  );
}
