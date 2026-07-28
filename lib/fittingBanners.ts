export interface FittingBannerConfig {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}

export const FITTING_BANNERS: Record<string, FittingBannerConfig> = {
  blazers: {
    title: "Unsure about the size?",
    description:
      "Feel free to visit our shop for blazer fitting. No appointment needed.",
    buttonLabel: "Help With Directions",
    href: "/contact#visit-us",
  },
};

export function getFittingBanner(
  categorySlugs: string[] | undefined | null
): FittingBannerConfig | null {
  if (!categorySlugs) return null;
  for (const slug of categorySlugs) {
    if (FITTING_BANNERS[slug]) return FITTING_BANNERS[slug];
  }
  return null;
}