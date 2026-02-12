import { Metadata } from "next";
import { Mail, Linkedin, Github, Calendar, ArrowUpRight } from "lucide-react";

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
    },
    {
      icon: Linkedin,
      label: t.linkedin.label,
      value: t.linkedin.value,
      action: t.linkedin.action,
      href: "https://linkedin.com/in/orangec-at",
    },
    {
      icon: Github,
      label: t.github.label,
      value: t.github.value,
      action: t.github.action,
      href: "https://github.com/orangec-at",
    },
    {
      icon: Calendar,
      label: t.schedule.label,
      value: t.schedule.value,
      action: t.schedule.action,
      href: "mailto:radio941016@gmail.com?subject=Schedule%20a%20Call",
    },
  ];

  return (
    <div className="container-narrow py-section space-y-16 md:space-y-20">
      <section className="space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-micro font-medium tracking-wide uppercase text-muted-foreground">
              {t.availability}
            </span>
          </div>

          <h1 className="text-display font-serif tracking-tight text-foreground leading-[1.1]">
            {t.heading}
            <span className="mt-2 block text-h2 font-serif text-ember-accent/85">
              {t.subheading}
            </span>
          </h1>

          <p className="max-w-2xl text-body leading-relaxed text-muted-foreground">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 ease-out hover:border-ember-accent/40 hover:bg-accent/30 md:h-56"
            >
              <div className="flex justify-between items-start">
                <div className="rounded-xl border border-border bg-background p-3 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <method.icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ember-accent" />
              </div>

              <div className="space-y-1 z-10">
                <h3 className="text-h3 text-foreground">
                  {method.label}
                </h3>
                <p className="text-small font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {method.action}
                </p>
              </div>

              <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-ember-accent/20 to-transparent opacity-0 blur-2xl transition-transform duration-500 group-hover:scale-150 group-hover:opacity-100" />
            </a>
          ))}
        </div>

        <div className="mt-20 border-t border-dashed border-border pt-8">
          <p className="text-micro text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} Jaeil Lee. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
