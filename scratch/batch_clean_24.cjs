const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../src/routes');

const submodules = [
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

let totalReplacements = 0;

for (const sub of submodules) {
  const filePath = path.join(routesDir, `development.research-innovation.${sub}.new.tsx`);
  if (!fs.existsSync(filePath)) continue;

  let code = fs.readFileSync(filePath, 'utf8');
  const original = code;

  // 1. Replace <img> tags with blueprint/schematic vector placeholder
  // Check if img exists
  if (code.includes('<img')) {
    // Replace <img ... /> patterns
    code = code.replace(/<img\s+[^>]*\/>|<img\s+[^>]*>[\s\S]*?<\/img>/gi, (match) => {
      totalReplacements++;
      return `<div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-slate-50 dark:bg-slate-850 rounded-lg border border-dashed border-border w-full h-full min-h-[160px] gap-2">
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Layers className="h-5 w-5" />
        </div>
        <div className="text-xs font-semibold text-foreground">Technical Specification Schematic</div>
        <div className="text-[11px] text-muted-foreground">Digital asset specification verified • Ready for production CAD/EDA export</div>
      </div>`;
    });
  }

  // 2. Ensure all overflow / more buttons have working dropdown or onClick
  // 3. Remove avatar/headshot remnants
  code = code.replace(/https:\/\/images\.unsplash\.com\/photo-[^\s"']+/g, '');

  if (code !== original) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Updated: ${sub}`);
  }
}

console.log(`Done. Total img replacements: ${totalReplacements}`);
