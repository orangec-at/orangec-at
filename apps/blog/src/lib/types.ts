export interface Post {
  id: string;
  slug: string;
  locale: string;
  title: string;
  category: string;
  date: string;
  color: string;
  content: string;
  tags?: string[];
  readTime?: string;
  thumbnail?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface Fragment {
  id: string;
  content: string;
  date: string;
  tags: string[];
  rotation?: number;
}

export type ViewState =
  | "home"
  | "post"
  | "threads"
  | "catalog"
  | "shop"
  | "about"
  | "profile"
  | "admin"
  | "design-system";

export type ThemeMode = "light" | "dark";
