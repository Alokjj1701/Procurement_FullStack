export enum RequestStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  modelNo: string;
  supplier?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    category: string;
    contactPerson: string;
    status: string;
  };
}

export interface Request {
  id: number;
  justification: string;
  quantity: number;
  requestedBy: string;
  status: RequestStatus;
  product: Product;
  department: string;
  priority: string;
  createdAt: string;
  date?: string;
  totalAmount?: number;
  supplier?: string;
}

export interface CreateRequestDTO {
  justification: string;
  quantity: number;
  productId: number;
  department: string;
  priority: string;
}

export interface UpdateRequestDTO {
  status?: RequestStatus;
  quantity?: number;
  justification?: string;
  department?: string;
  priority?: string;
} 