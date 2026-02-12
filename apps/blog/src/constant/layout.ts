import { FileText, FolderOpen, Home, Mail, User } from "lucide-react";

export const APP_NAME = "OrangeCat";

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
    translationKey: "navigation.about",
    href: "/about",
    icon: User,
  },
  {
    translationKey: "navigation.contact",
    href: "/contact",
    icon: Mail,
  },
];
