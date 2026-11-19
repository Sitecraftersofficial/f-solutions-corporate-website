import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { uploadMedia } from "@/lib/admin";
import { toast } from "sonner";

export function AssetInput({ value, onChange, image = false, required = false, label }: { value: string; onChange: (url: string) => void; image?: boolean; required?: boolean; label: string }) {
  const [busy, setBusy] = useState(false);
  return <div className="space-y-2">
    <Input aria-label={label} type="url" value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary"><Upload className="size-4" />{busy ? "Uploading…" : "Upload file"}
      <input className="sr-only" aria-label={`Upload ${label}`} type="file" accept={image ? "image/*" : ".pdf,.doc,.docx,.xls,.xlsx,image/*"} disabled={busy} onChange={async (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        setBusy(true); try { const asset = await uploadMedia(file); onChange(asset.url); toast.success("File uploaded"); } catch (error) { toast.error(error instanceof Error ? error.message : "Upload failed"); } finally { setBusy(false); e.target.value = ""; }
      }} />
    </label>
    {image && value && <img src={value} alt={label} className="h-24 max-w-full rounded-md border border-border object-contain" />}
  </div>;
}