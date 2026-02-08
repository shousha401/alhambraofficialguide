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
      tours: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_es: string;
          short_description_en: string;
          short_description_es: string;
          description_en: string | null;
          description_es: string | null;
          itinerary_en: string | null;
          itinerary_es: string | null;
          inclusions_en: string[] | null;
          inclusions_es: string[] | null;
          exclusions_en: string[] | null;
          exclusions_es: string[] | null;
          duration_minutes: number;
          max_group_size: number;
          languages: string[] | null;
          price_from_cents: number | null;
          image_url: string | null;
          featured: boolean;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['tours']['Row']> & {
          slug: string;
          title_en: string;
          title_es: string;
          short_description_en: string;
          short_description_es: string;
          duration_minutes: number;
        };
        Update: Partial<Database['public']['Tables']['tours']['Insert']>;
      };
      faqs: {
        Row: {
          id: string;
          question_en: string;
          question_es: string;
          answer_en: string;
          answer_es: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['faqs']['Row']> & {
          question_en: string;
          question_es: string;
          answer_en: string;
          answer_es: string;
        };
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_es: string;
          excerpt_en: string;
          excerpt_es: string;
          content_en: string;
          content_es: string;
          image_url: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']> & {
          slug: string;
          title_en: string;
          title_es: string;
          excerpt_en: string;
          excerpt_es: string;
          content_en: string;
          content_es: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      tour_requests: {
        Row: {
          id: string;
          tour_id: string | null;
          locale: string;
          name: string;
          email: string;
          phone: string | null;
          preferred_date: string | null;
          number_of_guests: number | null;
          message: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['tour_requests']['Row']> & {
          locale: string;
          name: string;
          email: string;
        };
        Update: Partial<Database['public']['Tables']['tour_requests']['Insert']>;
      };
      legal_pages: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_es: string;
          content_en: string;
          content_es: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['legal_pages']['Row']>;
        Update: Partial<Database['public']['Tables']['legal_pages']['Insert']>;
      };
    };
  };
}
