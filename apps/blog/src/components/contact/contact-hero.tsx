import { Heading, Body } from "../ui/typography";

export default function ContactHero() {
  return (
    <section className="space-y-4 text-center">
      <Heading variant="s-700" as="h1" className="text-foreground">
        Contact Me
      </Heading>
      <Body variant="l-400" className="text-muted-foreground">
        Interested in working together? Reach out via email or social links below.
      </Body>
    </section>
  );
}
