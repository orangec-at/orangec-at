import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin, FaMailBulk } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <section className="flex flex-col md:flex-row justify-center gap-6">
      <Link href="mailto:jaeil@example.com" target="_blank">
        <Button variant="outline" className="flex items-center gap-2">
          <FaMailBulk /> Email
        </Button>
      </Link>
      <Link href="https://github.com/username" target="_blank">
        <Button variant="outline" className="flex items-center gap-2">
          <FaGithub /> GitHub
        </Button>
      </Link>
      <Link href="https://linkedin.com/in/username" target="_blank">
        <Button variant="outline" className="flex items-center gap-2">
          <FaLinkedin /> LinkedIn
        </Button>
      </Link>
    </section>
  );
}
