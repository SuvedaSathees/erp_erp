const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../src/routes');

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

const filesToInspect = targetSubmodules.map(sub => ({
  sub,
  file: path.join(routesDir, `development.research-innovation.${sub}.new.tsx`)
}));

const report = {};

for (const { sub, file } of filesToInspect) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');

  const imgTags = code.match(/<img[^>]*>/gi) || [];
  report[sub] = {
    imgCount: imgTags.length,
    imgLines: []
  };

  const lines = code.split('\n');
  lines.forEach((line, idx) => {
    if (/<img/i.test(line)) {
      report[sub].imgLines.push({ line: idx + 1, text: line.trim() });
    }
  });
}

fs.writeFileSync(path.join(__dirname, 'img_report.json'), JSON.stringify(report, null, 2));
console.log('Report written to scratch/img_report.json');
