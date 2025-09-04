import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="text-center">
      <Link href="/contact" className="underline text-blue-600">
        Contact Me
      </Link>
    </section>
  );
}
