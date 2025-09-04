import Link from "next/link";

interface BlogCardProps {
  title: string;
  date: string;
  slug: string;
}

export default function BlogCard({ title, date, slug }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="block p-4 border rounded hover:shadow-md"
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{date}</p>
    </Link>
  );
}
