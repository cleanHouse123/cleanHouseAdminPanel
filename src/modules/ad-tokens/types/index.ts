export interface AdToken {
  id: number;
  token: string;
  reference: string;
  clickCount: number;
  createdAt: string;
}

export interface CreateAdTokenRequest {
  reference: string;
}
