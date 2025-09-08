export const APP_NAME = "OrangeCat's Blog";
import { Home, FolderOpen, FileText, Mail } from "lucide-react";

// Navigation items with translation keys
export const MENU_ITEMS = [
  {
    translationKey: "navigation.home",
    href: "/",
    icon: Home,
  },
  {
    translationKey: "navigation.projects", 
    href: "/projects",
    icon: FolderOpen,
  },
  {
    translationKey: "navigation.blog",
    href: "/blog", 
    icon: FileText,
  },
  {
    translationKey: "navigation.contact",
    href: "/contact",
    icon: Mail,
  },
];
