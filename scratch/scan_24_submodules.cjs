const fs = require('fs');
const path = require('path');

const targetSubmodules = [
  'product-strategy',
  'product-roadmap',
  'prd',
  'product-architecture',
  'industrial-design',
  'mechanical-design',
  'electrical-design',
  'electronics-design',
  'embedded-systems-development',
  'firmware-development',
  'software-development',
  'mobile-app-development',
  'cloud-platform-development',
  'api-development',
  'ai-model-development',
  'iot-development',
  'ui-ux-development',
  'cybersecurity-engineering',
  'simulation-analysis',
  'testing-validation',
  'certification-readiness',
  'product-documentation',
  'product-release-management',
  'product-lifecycle-management',
];

const routesDir = path.join(__dirname, '../src/routes');

const results = [];

for (const sub of targetSubmodules) {
  const filePath = path.join(routesDir, `development.research-innovation.${sub}.new.tsx`);
  if (!fs.existsSync(filePath)) {
    results.push({ sub, error: 'File not found: ' + filePath });
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  // Check for <img> tags
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  
  // Check for avatar references
  const avatarMatches = content.match(/(https:\/\/images\.unsplash\.com[^\s"']*|avatarUrl|profilePic|avatar_url)/gi) || [];

  // Check for duplicate h1
  const h1Matches = content.match(/<h1[^>]*>/gi) || [];

  // Check for empty onClick
  const emptyOnClickMatches = content.match(/onClick=\{\s*\(\)\s*=>\s*\{\s*\}\s*\}/gi) || [];

  // Check for buttons without onClick (simple check)
  const buttonsWithoutOnClick = (content.match(/<Button(?![^>]*onClick)[^>]*>/gi) || []).filter(b => !b.includes('type="submit"') && !b.includes('asChild'));

  results.push({
    sub,
    lines: content.split('\n').length,
    imgCount: imgMatches.length,
    imgSnippets: imgMatches.slice(0, 3),
    avatarMatchesCount: avatarMatches.length,
    h1Count: h1Matches.length,
    emptyOnClickCount: emptyOnClickMatches.length,
    buttonsWithoutOnClickCount: buttonsWithoutOnClick.length,
  });
}

console.log(JSON.stringify(results, null, 2));
