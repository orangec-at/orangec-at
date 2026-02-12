import { Metadata } from "next";
import { Mail, Linkedin, Github, Calendar, ArrowUpRight } from "lucide-react";
import { colors, typography, spacing, grid } from "@/lib/design-tokens";

type Props = {
  params: Promise<{ locale: string }>;
};

const DICTIONARY = {
  en: {
    title: "Contact",
    heading: "Get in touch",
    subheading: "Let's build something impossible.",
    availability: "Available for new opportunities",
    description: "Whether you have a question, a project in mind, or just want to say hi, I'm always open to discussing new ideas.",
    email: {
      label: "Email",
      value: "radio941016@gmail.com",
      action: "Send a message",
    },
    linkedin: {
      label: "LinkedIn",
      value: "linkedin.com/in/orangec-at",
      action: "Connect",
    },
    github: {
      label: "GitHub",
      value: "github.com/orangec-at",
      action: "Follow",
    },
    schedule: {
      label: "Schedule",
      value: "Book a meeting",
      action: "Select a time",
    },
    metaTitle: "Contact | Jaeil Lee",
    metaDescription: "Get in touch with Jaeil Lee. Available for new projects and collaborations.",
  },
  ko: {
    title: "문의하기",
    heading: "문의하기",
    subheading: "함께 불가능을 실현해봅시다.",
    availability: "새로운 프로젝트 참여 가능",
    description: "새로운 기회와 협업에 언제나 열려있습니다. 궁금한 점이 있으시거나 프로젝트 제안, 혹은 가벼운 인사라도 언제든 환영합니다.",
    email: {
      label: "이메일",
      value: "radio941016@gmail.com",
      action: "메세지 보내기",
    },
    linkedin: {
      label: "링크드인",
      value: "linkedin.com/in/orangec-at",
      action: "1촌 맺기",
    },
    github: {
      label: "깃허브",
      value: "github.com/orangec-at",
      action: "팔로우",
    },
    schedule: {
      label: "미팅 예약",
      value: "미팅 일정 잡기",
      action: "시간 선택",
    },
    metaTitle: "문의하기 | 이재일",
    metaDescription: "이재일에게 연락하기. 새로운 프로젝트와 협업 제안을 기다립니다.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === "ko" ? "ko" : "en";
  const t = DICTIONARY[lang];

  return {
    title: t.metaTitle,
    description: t.metaDescription,
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const lang = locale === "ko" ? "ko" : "en";
  const t = DICTIONARY[lang];

  const contactMethods = [
    {
      icon: Mail,
      label: t.email.label,
      value: t.email.value,
      action: t.email.action,
      href: "mailto:radio941016@gmail.com",
      color: "hover:text-blue-500 dark:hover:text-blue-400",
    },
    {
      icon: Linkedin,
      label: t.linkedin.label,
      value: t.linkedin.value,
      action: t.linkedin.action,
      href: "https://linkedin.com/in/orangec-at",
      color: "hover:text-blue-600 dark:hover:text-blue-500",
    },
    {
      icon: Github,
      label: t.github.label,
      value: t.github.value,
      action: t.github.action,
      href: "https://github.com/orangec-at",
      color: "hover:text-purple-600 dark:hover:text-purple-400",
    },
    {
      icon: Calendar,
      label: t.schedule.label,
      value: t.schedule.value,
      action: t.schedule.action,
      href: "mailto:radio941016@gmail.com?subject=Schedule%20a%20Call", 
      color: "hover:text-green-600 dark:hover:text-green-400",
    },
  ];

  return (
    <div className={`min-h-screen ${colors.background.primary}`}>
      <div className={`mx-auto ${grid.container.narrow} ${grid.padding.page}`}>
        
        <div className={`mb-16 md:mb-24 ${spacing.element}`}>
          <div className="flex items-center gap-2 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className={`text-sm font-medium tracking-wide uppercase ${colors.text.muted}`}>
              {t.availability}
            </span>
          </div>
          
          <h1 className={`${typography.hero} text-5xl md:text-7xl tracking-tight leading-[1.1]`}>
            {t.heading}
            <span className="block text-wood-500 dark:text-wood-400 opacity-80 mt-2 text-3xl md:text-5xl font-normal">
              {t.subheading}
            </span>
          </h1>
          
          <p className={`${typography.body} text-xl md:text-2xl max-w-2xl leading-relaxed text-gray-500 dark:text-gray-400 mt-8`}>
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative p-8 rounded-2xl border ${colors.border.light} 
                bg-gray-50/50 dark:bg-gray-800/50 
                hover:bg-white dark:hover:bg-gray-800 
                hover:border-gray-300 dark:hover:border-gray-600 
                transition-all duration-300 ease-out
                flex flex-col justify-between h-48 md:h-56 overflow-hidden`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl bg-white dark:bg-gray-900 border ${colors.border.light} 
                  group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <method.icon className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={1.5} />
                </div>
                <ArrowUpRight className={`w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white 
                  group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300`} />
              </div>

              <div className="space-y-1 z-10">
                <h3 className={`font-semibold text-lg ${colors.text.primary}`}>
                  {method.label}
                </h3>
                <p className={`${colors.text.muted} text-sm font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors`}>
                  {method.action}
                </p>
              </div>

              <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-gray-200/50 to-transparent dark:from-gray-700/30 rounded-full blur-2xl 
                group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100 pointer-events-none`} />
            </a>
          ))}
        </div>

        <div className="mt-24 pt-8 border-t border-dashed border-gray-200 dark:border-gray-800">
          <p className={`${typography.caption} text-center`}>
            &copy; {new Date().getFullYear()} Jaeil Lee. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
