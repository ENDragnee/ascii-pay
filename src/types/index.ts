export interface RequestParams {
  params: Promise<{
    id: string;
  }>;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  permission?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  defaultAmount: number | null;
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  type: string;
  agencyId: string;
  customerId: string;
  productId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agency {
  id: string;
  name: string;
  phone: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionWithRelations extends Transaction {
  agency: Agency;
  customer: Customer;
  product: Product | null; // This was missing and caused the error
}
