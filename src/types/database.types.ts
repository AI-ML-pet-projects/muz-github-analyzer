export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          type: "production" | "development";
          usage: number;
          key: string;
          monthly_limit: number | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          type: "production" | "development";
          usage?: number;
          key: string;
          monthly_limit?: number | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          type?: "production" | "development";
          usage?: number;
          key?: string;
          monthly_limit?: number | null;
          user_id?: string;
        };
      };
    };
  };
}
