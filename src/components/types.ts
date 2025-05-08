export interface ApiKey {
  id: number;
  name: string;
  type: "production" | "development";
  usage: number;
  key: string;
  monthlyLimit?: number;
}

export interface ApiKeyFormData {
  name: string;
  type: "production" | "development";
  monthlyLimit?: number;
}
