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
    href: "/customers",
    icon: "Users",
    permission: "manage-customers",
  },
  {
    title: "Products",
    href: "/products",
    icon: "Package",
    permission: "manage-products",
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: "ArrowRightLeft",
    permission: "initiate-payment",
  },
  {
    title: "History",
    href: "/history",
    icon: "History",
    permission: "view-reports",
  },
  {
    title: "Agency",
    href: "/agency",
    icon: "Building2",
    permission: "manage-agency",
  },
];
