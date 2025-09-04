import { Button } from "@/components/ui/button";

export default function ContactForm() {
  return (
    <section className="max-w-md mx-auto">
      <form>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          placeholder="Message"
          className="w-full mb-2 p-2 border rounded"
          rows={5}
        />
        <Button type="submit">Send</Button>
      </form>
    </section>
  );
}
