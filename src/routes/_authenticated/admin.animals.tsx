import { createFileRoute } from "@tanstack/react-router";
import { RecordsManager } from "@/components/admin/RecordsManager";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/_authenticated/admin/animals")({ head: () => seo("Manage Animal Types", "F-Solutions Ltd administrator animal types management."), component: () => <RecordsManager table="animal_types" /> });
