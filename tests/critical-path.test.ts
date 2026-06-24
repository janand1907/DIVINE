/**
 * Critical-path unit tests for Divine Travel.
 *
 * These tests cover the schemas and pure-function helpers that gate every
 * business-critical path:
 *   - Lead flow       (validation, mobile format, future-date check)
 *   - Package mgmt    (slug format, required fields, JSON shape)
 *   - Blog publishing (slug format, required fields)
 *   - SEO             (metadata builder defaults, reading-time computation)
 *
 * Run with: `npx tsx tests/critical-path.test.ts` (after `npm i -D tsx`).
 *
 * Tests are written as a tiny assertion runner so they don't depend on any
 * test framework install. Each test() call prints PASS or FAIL and we exit
 * non-zero if any failed.
 */

import { leadSchema, packageSchema, blogSchema } from '@/lib/validation/schemas';
import { computeReadingTime } from '@/lib/seo/metadata';
import { hexToRgbChannels } from '@/lib/theme/theme';

let pass = 0;
let fail = 0;
const failures: string[] = [];

function test(name: string, fn: () => void | Promise<void>) {
  try {
    fn();
    pass += 1;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    fail += 1;
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ✗ ${name}\n      ${msg}`);
    failures.push(`${name}: ${msg}`);
  }
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function assertEqual<T>(actual: T, expected: T, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ===========================================================
// LEAD FLOW
// ===========================================================
console.log('\n=== Lead Flow ===');

test('lead schema accepts a valid full payload', () => {
  const result = leadSchema.safeParse({
    name: 'Ramesh Kumar',
    mobile: '+919876543210',
    email: 'ramesh@example.com',
    destination: 'Tirupati',
    travel_date: '2099-01-15',
    adults: 2,
    children: 0,
    budget: '₹10,000 - ₹15,000',
    message: 'Looking for darshan package',
    source: 'contact',
  });
  assert(result.success, 'Should pass for valid payload');
});

test('lead schema accepts minimal required fields', () => {
  const result = leadSchema.safeParse({
    name: 'Test',
    mobile: '9876543210',
    source: 'quick-quote',
  });
  assert(result.success, 'Should pass with name + mobile only');
});

test('lead schema rejects missing name', () => {
  const result = leadSchema.safeParse({ mobile: '9876543210' });
  assert(!result.success, 'Should fail without name');
});

test('lead schema rejects invalid Indian mobile', () => {
  const r1 = leadSchema.safeParse({ name: 'Test', mobile: '12345' });
  assert(!r1.success, 'Short number should fail');
  const r2 = leadSchema.safeParse({ name: 'Test', mobile: '+91512345678' }); // starts with 5
  assert(!r2.success, 'Number starting with 5 should fail (Indian mobiles start 6-9)');
});

test('lead schema rejects past travel date', () => {
  const result = leadSchema.safeParse({
    name: 'Test', mobile: '9876543210', travel_date: '2020-01-01',
  });
  assert(!result.success, 'Past travel date should fail');
});

test('lead schema accepts empty travel date (optional)', () => {
  const result = leadSchema.safeParse({
    name: 'Test', mobile: '9876543210', travel_date: '',
  });
  assert(result.success, 'Empty travel date should pass');
});

test('lead schema rejects invalid email format', () => {
  const result = leadSchema.safeParse({
    name: 'Test', mobile: '9876543210', email: 'not-an-email',
  });
  assert(!result.success, 'Invalid email should fail');
});

test('lead schema accepts empty email (optional)', () => {
  const result = leadSchema.safeParse({
    name: 'Test', mobile: '9876543210', email: '',
  });
  assert(result.success, 'Empty email should pass');
});

test('lead schema accepts +91 prefix on mobile', () => {
  const result = leadSchema.safeParse({
    name: 'Test', mobile: '+919876543210',
  });
  assert(result.success, '+91 prefix should pass');
});

test('lead schema accepts 91 prefix without +', () => {
  const result = leadSchema.safeParse({
    name: 'Test', mobile: '919876543210',
  });
  assert(result.success, '91 prefix without + should pass');
});

// ===========================================================
// PACKAGE MANAGEMENT
// ===========================================================
console.log('\n=== Package Management ===');

test('package schema accepts valid full package', () => {
  const result = packageSchema.safeParse({
    slug: 'navagraha-temple-tour-2d1n',
    title: 'Navagraha Temple Tour (2D/1N)',
    destinations: ['Kumbakonam', 'Suryanar'],
    duration_days: 2,
    duration_nights: 1,
    overview: 'A spiritually enriching tour.',
    inclusions: ['AC vehicle'],
    exclusions: ['Airfare'],
    pricing: [{ label: 'Standard', price: '₹6,500', inclusions: ['Breakfast'] }],
    is_featured: true,
    is_published: true,
  });
  assert(result.success, 'Full package should pass');
});

test('package schema rejects title without slug-compatible characters', () => {
  const result = packageSchema.safeParse({
    slug: 'Navagraha Tour', // uppercase + space
    title: 'Navagraha Tour',
    duration_days: 1,
    duration_nights: 0,
  });
  assert(!result.success, 'Uppercase + space in slug should fail');
});

test('package schema rejects empty slug', () => {
  const result = packageSchema.safeParse({
    slug: '',
    title: 'Test',
    duration_days: 1,
    duration_nights: 0,
  });
  assert(!result.success, 'Empty slug should fail');
});

test('package schema rejects slug with special chars', () => {
  const r = packageSchema.safeParse({
    slug: 'tour!special', title: 'Test', duration_days: 1, duration_nights: 0,
  });
  assert(!r.success, 'Special char in slug should fail');
});

test('package schema accepts numeric slug suffix', () => {
  const r = packageSchema.safeParse({
    slug: 'dubai-tour-2025', title: 'Dubai Tour', duration_days: 5, duration_nights: 4,
  });
  assert(r.success, 'Numeric suffix in slug should pass');
});

test('package schema allows 0-day package (day trip)', () => {
  const r = packageSchema.safeParse({
    slug: 'day-trip', title: 'Day Trip', duration_days: 1, duration_nights: 0,
  });
  assert(r.success, 'Day trip should pass');
});

test('package schema rejects impossible duration (>365 days)', () => {
  const r = packageSchema.safeParse({
    slug: 'long-tour', title: 'Long', duration_days: 400, duration_nights: 399,
  });
  assert(!r.success, '>365 days should fail');
});

test('package schema accepts valid itinerary structure', () => {
  const r = packageSchema.safeParse({
    slug: 'tour', title: 'Tour',
    duration_days: 1, duration_nights: 0,
    itinerary: [{ day: 1, title: 'Day 1', description: 'Arrival' }],
  });
  assert(r.success, 'Itinerary with day/title/description should pass');
});

test('package schema rejects starting_price < 0', () => {
  const r = packageSchema.safeParse({
    slug: 'tour', title: 'T', duration_days: 1, duration_nights: 0, starting_price: -100,
  });
  assert(!r.success, 'Negative starting_price should fail');
});

// ===========================================================
// BLOG PUBLISHING
// ===========================================================
console.log('\n=== Blog Publishing ===');

test('blog schema accepts valid draft post', () => {
  const r = blogSchema.safeParse({
    slug: 'navagraha-temples-guide',
    title: 'Complete Guide to Navagraha Temples',
    content: '## Introduction\n\nThe Navagraha temples...',
    tags: ['navagraha', 'temples'],
  });
  assert(r.success, 'Draft blog should pass');
});

test('blog schema rejects slug with uppercase', () => {
  const r = blogSchema.safeParse({
    slug: 'Navagraha-Guide', title: 'Guide', content: '',
  });
  assert(!r.success, 'Uppercase slug should fail');
});

test('blog schema rejects slug with spaces', () => {
  const r = blogSchema.safeParse({
    slug: 'navagraha guide', title: 'Guide', content: '',
  });
  assert(!r.success, 'Slug with space should fail');
});

test('blog schema accepts slug with hyphens and digits', () => {
  const r = blogSchema.safeParse({
    slug: 'tirupati-2025-guide', title: 'Guide', content: '',
  });
  assert(r.success, 'Hyphenated slug with digits should pass');
});

test('blog schema rejects empty title', () => {
  const r = blogSchema.safeParse({
    slug: 'guide', title: '', content: '',
  });
  assert(!r.success, 'Empty title should fail');
});

test('blog schema allows published_at to be null (draft)', () => {
  const r = blogSchema.safeParse({
    slug: 'guide', title: 'Guide', content: '', published_at: null,
  });
  assert(r.success, 'null published_at should pass (draft)');
});

// ===========================================================
// SEO GENERATION
// ===========================================================
console.log('\n=== SEO Generation ===');

test('computeReadingTime returns at least 1 for short content', () => {
  const t = computeReadingTime('Short content.');
  assert(t >= 1, 'Reading time should be at least 1 minute');
});

test('computeReadingTime computes 200 wpm correctly', () => {
  // 600 words ~ 3 minutes
  const words = Array.from({ length: 600 }, () => 'word').join(' ');
  assertEqual(computeReadingTime(words), 3, '600 words → 3 min');
});

test('computeReadingTime handles empty content', () => {
  assertEqual(computeReadingTime(''), 1, 'Empty content → 1 min (minimum)');
});

test('computeReadingTime handles whitespace-only content', () => {
  assertEqual(computeReadingTime('   \n\n\t  '), 1, 'Whitespace → 1 min');
});

test('hexToRgbChannels converts brand primary correctly', () => {
  // #C48A2D → R=196, G=138, B=45
  assertEqual(hexToRgbChannels('#C48A2D'), '196 138 45', 'Primary #C48A2D converts correctly');
});

test('hexToRgbChannels converts secondary brand color', () => {
  // #8B1E3F → R=139, G=30, B=63
  assertEqual(hexToRgbChannels('#8B1E3F'), '139 30 63', 'Secondary #8B1E3F converts correctly');
});

test('hexToRgbChannels falls back on invalid hex', () => {
  // Invalid hex → should fall back to primary default, not throw
  const result = hexToRgbChannels('not-a-hex');
  assertEqual(result, '196 138 45', 'Invalid hex should fall back to primary default');
});

test('hexToRgbChannels handles lowercase hex', () => {
  assertEqual(hexToRgbChannels('#c48a2d'), '196 138 45', 'Lowercase hex should convert correctly');
});

// ===========================================================
// SUMMARY
// ===========================================================
console.log(`\n---\n${pass} passed, ${fail} failed.`);
if (fail > 0) {
  console.error('Failures:');
  failures.forEach((f) => console.error(`  • ${f}`));
  process.exit(1);
}
process.exit(0);
