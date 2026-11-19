import { createFileRoute } from "@tanstack/react-router";
import { RecordsManager } from "@/components/admin/RecordsManager";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/_authenticated/admin/documents")({ head: () => seo("Manage Compliance Documents", "F-Solutions Ltd administrator compliance documents management."), component: () => <RecordsManager table="compliance_documents" /> });
