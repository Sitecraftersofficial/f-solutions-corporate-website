import { createFileRoute } from "@tanstack/react-router";
import { RecordsManager } from "@/components/admin/RecordsManager";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/_authenticated/admin/partners")({ head: () => seo("Manage Partners", "F-Solutions Ltd administrator partners management."), component: () => <RecordsManager table="partners" /> });
