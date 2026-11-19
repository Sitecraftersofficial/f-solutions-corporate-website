export type ManagedTable = "products" | "categories" | "animal_types" | "partners" | "compliance_documents";
export type Field = { key: string; label: string; type?: "textarea" | "checkbox" | "number" | "division" | "category" | "image" | "document" | "url"; required?: boolean };
export const adminModules: Record<ManagedTable, { title: string; fields: Field[] }> = {
  products: { title: "Products", fields: [
    { key: "name", label: "Product name", required: true }, { key: "slug", label: "Page address", required: true },
    { key: "division", label: "Division", type: "division", required: true }, { key: "category_id", label: "Category", type: "category" },
    { key: "brand", label: "Brand / manufacturer" }, { key: "short_description", label: "Short description", type: "textarea" },
    { key: "details", label: "Details", type: "textarea" }, { key: "specifications", label: "Specifications", type: "textarea" },
    { key: "image_url", label: "Product image", type: "image" }, { key: "document_url", label: "Product document", type: "document" },
    { key: "document_name", label: "Document name" }, { key: "is_prescription", label: "Prescription-only", type: "checkbox" },
    { key: "published", label: "Published", type: "checkbox" }, { key: "featured", label: "Featured", type: "checkbox" },
  ] },
  categories: { title: "Categories", fields: [{ key: "name", label: "Name", required: true }, { key: "slug", label: "Page address", required: true }, { key: "division", label: "Division", type: "division" }, { key: "description", label: "Description", type: "textarea" }, { key: "sort_order", label: "Display order", type: "number" }] },
  animal_types: { title: "Animal Types", fields: [{ key: "name", label: "Name", required: true }, { key: "slug", label: "Page address", required: true }, { key: "sort_order", label: "Display order", type: "number" }] },
  partners: { title: "Partners", fields: [{ key: "name", label: "Name", required: true }, { key: "description", label: "Description", type: "textarea" }, { key: "logo_url", label: "Partner logo", type: "image" }, { key: "website", label: "Website", type: "url" }, { key: "visible", label: "Visible", type: "checkbox" }, { key: "sort_order", label: "Display order", type: "number" }] },
  compliance_documents: { title: "Compliance Documents", fields: [{ key: "title", label: "Title", required: true }, { key: "description", label: "Description", type: "textarea" }, { key: "file_url", label: "Document", type: "document", required: true }, { key: "visible", label: "Visible", type: "checkbox" }] },
};

export function isAdminRole(rows: { role: string }[]) { return rows.some((r) => r.role === "admin"); }
export function safeWebUrl(value: string) { return !value || /^https?:\/\//i.test(value); }