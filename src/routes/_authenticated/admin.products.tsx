import { createFileRoute } from "@tanstack/react-router";
import { RecordsManager } from "@/components/admin/RecordsManager";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/_authenticated/admin/products")({ head: () => seo("Manage Products", "F-Solutions Ltd administrator products management."), component: () => <RecordsManager table="products" /> });
