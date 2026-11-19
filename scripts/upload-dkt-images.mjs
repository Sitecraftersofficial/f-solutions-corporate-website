// One-off script: downloads the 49 DKT product images and uploads them to the
// Supabase Storage bucket "product-images" under dkt/<slug>.png.
//
// Usage:
//   1. Set env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
//      (service role key — find it in Supabase Dashboard > Settings > API).
//   2. Run: node scripts/upload-dkt-images.mjs
//
// Requires Node 18+ (built-in fetch). Run "npm i @supabase/supabase-js" if needed.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-images";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars first.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// slug -> original DKT image URL
const IMAGES = {
  "aleze-ec": "https://www.dktinternational.org/wp-content/uploads/2025/04/aleze-EC.png",
  "aleze-iud": "https://www.dktinternational.org/wp-content/uploads/2025/04/aleze-iud.png",
  "aleze-oc": "https://www.dktinternational.org/wp-content/uploads/2025/04/Aleze-OC.png",
  "althea-silver":
    "https://www.dktinternational.org/wp-content/uploads/2026/08/prudence-condoms.png",
  andalan: "https://www.dktinternational.org/wp-content/uploads/2025/04/andalan-injectables.png",
  "andalan-diaphragm":
    "https://www.dktinternational.org/wp-content/uploads/2025/04/Andalan-diaphragm.png",
  "andalan-oral-contraceptive-pills":
    "https://www.dktinternational.org/wp-content/uploads/2025/05/andalan-OCPs.png",
  avibela: "https://www.dktinternational.org/wp-content/uploads/2025/04/Avibela-1.png",
  caya: "https://www.dktinternational.org/wp-content/uploads/2025/04/caya-diaphragm-e1745372226362.png",
  choice: "https://www.dktinternational.org/wp-content/uploads/2025/04/choice.png",
  "contraplan-ii": "https://www.dktinternational.org/wp-content/uploads/2025/02/contraplan-2-1.png",
  dianofem: "https://www.dktinternational.org/wp-content/uploads/2025/04/dianofem.png",
  eloira: "https://www.dktinternational.org/wp-content/uploads/2025/04/Aloira.png",
  femdien: "https://www.dktinternational.org/wp-content/uploads/2025/04/Femdien.png",
  fiesta: "https://www.dktinternational.org/wp-content/uploads/2025/04/fiesta-condoms-updated.png",
  "fiesta-lubricant":
    "https://www.dktinternational.org/wp-content/uploads/2025/04/Fiesta-lubricant.png",
  "hiwot-trust": "https://www.dktinternational.org/wp-content/uploads/2025/05/Hiwot-trust.png",
  ilefem: "https://www.dktinternational.org/wp-content/uploads/2025/04/ilefem.png",
  "ipas-mva": "https://www.dktinternational.org/wp-content/uploads/2025/04/ipas-MVA-1.png",
  kare: "https://www.dktinternational.org/wp-content/uploads/2025/04/u-kare-IUD.png",
  kiss: "https://www.dktinternational.org/wp-content/uploads/2025/04/kiss.png",
  levofem: "https://www.dktinternational.org/wp-content/uploads/2025/04/levofem.png",
  levoplant: "https://www.dktinternational.org/wp-content/uploads/2025/02/levoplant.png",
  "lydia-injection":
    "https://www.dktinternational.org/wp-content/uploads/2025/04/lydia-contraceptive-injection.png",
  "lydia-iud-ius": "https://www.dktinternational.org/wp-content/uploads/2025/04/Lydia-IUD.png",
  "lydia-oc": "https://www.dktinternational.org/wp-content/uploads/2025/04/Lydia-OC.png",
  "lydia-postpil": "https://www.dktinternational.org/wp-content/uploads/2025/04/Lydia-postpil.png",
  "ma-kare": "https://www.dktinternational.org/wp-content/uploads/2025/04/products-page-photos.png",
  medfem: "https://www.dktinternational.org/wp-content/uploads/2025/04/medfem.png",
  miacare: "https://www.dktinternational.org/wp-content/uploads/2025/04/MIAcare-IUD.png",
  mifecare:
    "https://www.dktinternational.org/wp-content/uploads/2025/04/Mifecare-e1745371073283.png",
  mifepak: "https://www.dktinternational.org/wp-content/uploads/2025/04/Mifepak.png",
  "miso-care": "https://www.dktinternational.org/wp-content/uploads/2025/04/Miso-Care-.png",
  "miso-fem": "https://www.dktinternational.org/wp-content/uploads/2025/04/Miso-fem.png",
  "miso-intimo": "https://www.dktinternational.org/wp-content/uploads/2025/04/miso-intimo.png",
  "miso-kare": "https://www.dktinternational.org/wp-content/uploads/2025/04/Miso-Kare-.png",
  misodia: "https://www.dktinternational.org/wp-content/uploads/2025/04/Misodia.png",
  "mva-kare": "https://www.dktinternational.org/wp-content/uploads/2025/04/mva-kare.png",
  ok: "https://www.dktinternational.org/wp-content/uploads/2025/05/ok-condoms.png",
  postpill: "https://www.dktinternational.org/wp-content/uploads/2025/04/Postpill-1.png",
  "prudence-female-condoms":
    "https://www.dktinternational.org/wp-content/uploads/2025/04/prudence-female-condoms.png",
  "prudence-lubricants":
    "https://www.dktinternational.org/wp-content/uploads/2025/04/Prudence-lubes.png",
  "prudence-male-condoms":
    "https://www.dktinternational.org/wp-content/uploads/2025/04/Global-supply-chain-management.png",
  "safe-t-kit": "https://www.dktinternational.org/wp-content/uploads/2025/04/Safe-t-kit-.png",
  seguro: "https://www.dktinternational.org/wp-content/uploads/2025/04/seguro-intimo.png",
  silverline: "https://www.dktinternational.org/wp-content/uploads/2025/04/silverline.png",
  sutra: "https://www.dktinternational.org/wp-content/uploads/2025/04/sutra.png",
  taneciprol: "https://www.dktinternational.org/wp-content/uploads/2025/04/Taneciprol-.png",
  trust: "https://www.dktinternational.org/wp-content/uploads/2025/04/trust-e1745373539470.png",
};

// Ensure the bucket exists and is public.
const { data: buckets } = await supabase.storage.listBuckets();
if (!buckets?.some((b) => b.name === BUCKET)) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) throw error;
  console.log(`Created public bucket "${BUCKET}".`);
}

let ok = 0,
  failed = [];
for (const [slug, url] of Object.entries(IMAGES)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const path = `dkt/${slug}.png`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buf, { contentType: "image/png", upsert: true });
    if (error) throw error;
    ok++;
    console.log(`✔ ${path} (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    failed.push(slug);
    console.error(`✖ ${slug}: ${e.message}`);
  }
}

console.log(
  `\nDone: ${ok} uploaded, ${failed.length} failed${failed.length ? ": " + failed.join(", ") : ""}.`,
);
