export interface RequestParams {
  params: Promise<{
    id: string;
  }>;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string; // Lucide icon name
  permission?: string;
}
