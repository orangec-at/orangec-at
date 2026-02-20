export type LensId = "component" | "business" | "design" | "ux" | "tech";

export interface AnalysisItem {
  title: string;
  body: string;
}

export interface InsightItem {
  title: string;
  body: string;
}

export interface LensData {
  id: LensId;
  label: string;
  observe: React.ReactNode;
  analysis: AnalysisItem[];
  insights: InsightItem[];
}

export type DeviceType = "mobile" | "desktop";
