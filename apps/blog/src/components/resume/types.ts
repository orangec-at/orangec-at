export interface PersonalInfo {
  nameKorean: string;
  nameEnglish: string;
  birthDate: string;
  email: string;
  phone: string;
  sns: string;
  twitter?: string;
  linkedin?: string;
  blog?: string;
  address: string;
  photoUrl?: string;
}

export interface MilitaryService {
  branch: string;
  status: string;
  rank: string;
  location: string;
  period: string;
  veteranStatus: string;
}

export interface Education {
  date: string;
  school: string;
  major: string;
}

export interface WorkExperience {
  period: string;
  company: string;
  position: string;
  department: string;
  rank: string;
}

export interface LanguageSkill {
  language: string;
  certification: string;
}

export interface ComputerSkill {
  name: string;
  level: string;
}

export interface Skills {
  languages: LanguageSkill[];
  computer: ComputerSkill[];
}

export interface Certificate {
  name: string;
  issuer: string;
  year: string;
}

export interface ProjectHighlight {
  company: string;
  name: string;
  period: string;
  description: string;
  achievements?: string[];
  techStack?: string[];
}

export interface ResumeData {
  introduction?: string;
  personalInfo: PersonalInfo;
  military: MilitaryService;
  education: Education[];
  experience: WorkExperience[];
  skills: Skills;
  certificates?: Certificate[];
  projects?: ProjectHighlight[];
}
