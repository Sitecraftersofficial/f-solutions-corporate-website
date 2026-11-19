// One-off script: downloads the 9 ACON "On Call" product images and uploads
// them to the Supabase Storage bucket "product-images" under acon/<slug>.png.
//
// Usage:
//   1. Set env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
//   2. Run: node scripts/upload-acon-images.mjs
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

// slug -> original ACON image URL
const IMAGES = {
  "on-call-express-family": "https://www.aconlabs.com/wp-content/uploads/2020/06/OCX-II-meter1.png",
  "on-call-pro-bgms": "https://www.aconlabs.com/wp-content/uploads/2020/06/oncall-pro-meter.png",
  "on-call-stealth":
    "https://www.aconlabs.com/wp-content/uploads/2020/06/on-call-gentouch-e1593476074806.png",
  "on-call-extra-family":
    "https://www.aconlabs.com/wp-content/uploads/2020/06/OCXT-CR_mgdL_meter.png",
  "on-call-sure-family":
    "https://www.aconlabs.com/wp-content/uploads/2020/06/on-call-sure-meter.png",
  "on-call-gk-dual": "https://www.aconlabs.com/wp-content/uploads/2020/06/on-call-gk-dual.png",
  "on-call-vivid": "https://www.aconlabs.com/wp-content/uploads/2020/09/OnCall-Vivid_Meter_RGB.png",
  "on-call-gentouch":
    "https://www.aconlabs.com/wp-content/uploads/2020/06/on-call-gentouch-e1593476074806.png",
  "on-call-multipro":
    "https://www.aconlabs.com/wp-content/uploads/2022/07/AconLabs_071822_Multipro.png",
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
    const path = `acon/${slug}.png`;
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
