const ADULT_SIZE_RANK: Record<string, number> = {
  "extra small – adults": 0,
  xxs: 0,
  xs: 1,
  "small – adults": 1,
  s: 2,
  "medium – adults": 3,
  m: 3,
  "large – adults": 4,
  l: 4,
  "extra large – adults": 5,
  xl: 5,
  xxl: 6,
  "2xl": 6,
  xxxl: 7,
  "3xl": 7,
  "4xl": 8,
  "5xl": 9,
  "6xl": 10,
};

const KIDS_AGE_PATTERN = /kids at (\d+)\s*[–-]\s*(\d+)\s*years?/i;

export function sortSizes(sizes: string[]): string[] {
  const adult: string[] = [];
  const kids: string[] = [];
  const numeric: string[] = [];
  const other: string[] = [];

  for (const size of sizes) {
    const key = size.trim().toLowerCase();
    if (key in ADULT_SIZE_RANK) {
      adult.push(size);
    } else if (KIDS_AGE_PATTERN.test(size)) {
      kids.push(size);
    } else if (/^\d+(\.\d+)?\s*"?$/.test(size.trim())) {
      numeric.push(size);
    } else {
      other.push(size);
    }
  }

  adult.sort(
    (a, b) => ADULT_SIZE_RANK[a.trim().toLowerCase()] - ADULT_SIZE_RANK[b.trim().toLowerCase()]
  );

  kids.sort((a, b) => {
    const am = a.match(KIDS_AGE_PATTERN)!;
    const bm = b.match(KIDS_AGE_PATTERN)!;
    const aStart = parseInt(am[1], 10);
    const bStart = parseInt(bm[1], 10);
    if (aStart !== bStart) return aStart - bStart;
    return parseInt(am[2], 10) - parseInt(bm[2], 10);
  });

  numeric.sort((a, b) => parseFloat(a) - parseFloat(b));

  other.sort((a, b) => a.localeCompare(b));

  return [...adult, ...kids, ...numeric, ...other];
}