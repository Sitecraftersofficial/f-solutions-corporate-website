import { createFileRoute } from "@tanstack/react-router";
import { RecordsManager } from "@/components/admin/RecordsManager";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/_authenticated/admin/categories")({ head: () => seo("Manage Categories", "F-Solutions Ltd administrator categories management."), component: () => <RecordsManager table="categories" /> });
