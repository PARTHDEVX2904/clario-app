// Supabase database types
// Run `npx supabase gen types typescript` to auto-generate from your schema.
// These are hand-written for MVP — replace with generated types once you connect Supabase.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          patient_name: string | null;
          provider_name: string | null;
          provider_city: string | null;
          provider_state: string | null;
          provider_country: string;
          insurance_status: string | null;
          health_issue: string | null;
          had_er_visit: boolean;
          had_imaging: boolean;
          had_blood_tests: boolean;
          had_surgery: boolean;
          had_room_stay: boolean;
          had_medicines: boolean;
          had_followup: boolean;
          has_multiple_bills: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["cases"]["Row"],
          "created_at" | "updated_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["cases"]["Row"],
              "created_at" | "updated_at"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["cases"]["Row"]>;
      };
      documents: {
        Row: {
          id: string;
          case_id: string;
          type: string;
          file_path: string | null;
          file_name: string | null;
          file_size: number | null;
          mime_type: string | null;
          ocr_text: string | null;
          ocr_status: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["documents"]["Row"],
          "created_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["documents"]["Row"],
              "created_at"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["documents"]["Row"]>;
      };
      bill_analyses: {
        Row: {
          id: string;
          case_id: string;
          status: string;
          created_at: string;
          plain_summary: string | null;
          total_billed: number | null;
          total_flagged: number | null;
          potential_savings: number | null;
          confidence_score: number | null;
          raw_ai_response: Json | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["bill_analyses"]["Row"],
          "created_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["bill_analyses"]["Row"],
              "created_at"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["bill_analyses"]["Row"]>;
      };
      bill_line_items: {
        Row: {
          id: string;
          analysis_id: string;
          description: string | null;
          cpt_code: string | null;
          quantity: number | null;
          unit_price: number | null;
          total_price: number | null;
          date_of_service: string | null;
          flag_status: string;
          flag_reason: string | null;
          suggested_price: number | null;
          confidence: number | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["bill_line_items"]["Row"],
          never
        >;
        Update: Partial<
          Database["public"]["Tables"]["bill_line_items"]["Row"]
        >;
      };
      generated_outputs: {
        Row: {
          id: string;
          analysis_id: string;
          type: string;
          content: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["generated_outputs"]["Row"],
          "created_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["generated_outputs"]["Row"],
              "created_at"
            >
          >;
        Update: Partial<
          Database["public"]["Tables"]["generated_outputs"]["Row"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
