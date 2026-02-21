import { Button } from "@orangec-at/design";

export default function ContactForm() {
  return (
    <section className="w-full">
      <form className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <input
          type="text"
          placeholder="Name"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
        />
        <textarea
          placeholder="Message"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
          rows={5}
        />
        <Button type="submit" className="rounded-full">
          Send
        </Button>
      </form>
    </section>
  );
}
