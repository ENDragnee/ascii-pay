import { NavItem } from "@/types";

export const dashboardConfig: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: "LayoutDashboard",
    permission: "view-dashboard",
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: "Users",
    permission: "manage-customers",
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: "Package",
    permission: "manage-products",
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: "ArrowRightLeft",
    permission: "initiate-payment",
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: "History",
    permission: "view-reports",
  },
  {
    title: "Agency",
    href: "/dashboard/agency",
    icon: "Building2",
    permission: "manage-agency",
  },
];
