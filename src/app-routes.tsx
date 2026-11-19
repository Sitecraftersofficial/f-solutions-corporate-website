import type { RouteObject } from "react-router-dom";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AboutPage } from "@/routes/_site/about";
import { AgrovetPage } from "@/routes/_site/agrovet";
import { ContactPage } from "@/routes/_site/contact";
import { HomePage } from "@/routes/_site/index";
import { HumanHealthPage } from "@/routes/_site/human-health";
import { PartnersPage } from "@/routes/_site/partners";
import { ProductPage } from "@/routes/_site/products.$slug";
import { QualityPage } from "@/routes/_site/quality";
import { SignInPage } from "@/routes/auth";
import { DashboardPage } from "@/routes/_authenticated/admin.index";
import { AnimalsAdminPage } from "@/routes/_authenticated/admin.animals";
import { CategoriesAdminPage } from "@/routes/_authenticated/admin.categories";
import { DocumentsAdminPage } from "@/routes/_authenticated/admin.documents";
import { PartnersAdminPage } from "@/routes/_authenticated/admin.partners";
import { ProductsAdminPage } from "@/routes/_authenticated/admin.products";
import { NotFoundPage } from "@/routes/not-found";

export const appRoutes: RouteObject[] = [
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "human-health", element: <HumanHealthPage /> },
      { path: "agrovet", element: <AgrovetPage /> },
      { path: "partners", element: <PartnersPage /> },
      { path: "quality", element: <QualityPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "products/:slug", element: <ProductPage /> },
    ],
  },
  { path: "auth", element: <SignInPage /> },
  {
    path: "admin",
    element: <RequireAdmin />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "products", element: <ProductsAdminPage /> },
      { path: "categories", element: <CategoriesAdminPage /> },
      { path: "animals", element: <AnimalsAdminPage /> },
      { path: "partners", element: <PartnersAdminPage /> },
      { path: "documents", element: <DocumentsAdminPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
