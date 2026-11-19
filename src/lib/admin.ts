import { supabase } from "@/integrations/supabase/browser";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads a file to the private media bucket and returns a long-lived signed URL for public display. */
export async function uploadMedia(file: File, folder = "uploads") {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (e2 || !data) throw e2 ?? new Error("Could not create file link");
  const record = await supabase
    .from("media")
    .insert({ name: file.name, url: data.signedUrl, path });
  if (record.error) throw record.error;
  return { url: data.signedUrl, path };
}

export async function logAction(action: string, entity?: string, details?: string) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("activity_logs").insert({ user_id: data.user.id, action, entity, details });
}
