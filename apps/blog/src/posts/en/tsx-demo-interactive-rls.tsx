import type { MDXFrontmatter } from "@/types/frontmatter";

export const meta: MDXFrontmatter = {
  title: "Interactive Demo: How Supabase RLS Protects Your Data",
  description:
    "A visual walkthrough showing exactly how Row Level Security filters data per user in real-time. See the SQL policies in action.",
  date: "2026-02-14",
  tags: ["Supabase", "Security", "Interactive", "typescript"],
  category: "technical",
  author: "Jaeil Lee",
  relatedProjects: [],
  featured: false,
  draft: false,
  layout: "shared",
  seo: {
    keywords: [
      "Supabase RLS demo",
      "row level security visual",
      "multi-tenant data isolation",
    ],
  },
};

function PolicyCard({
  title,
  sql,
  description,
}: {
  title: string;
  sql: string;
  description: string;
}) {
  return (
    <div className="my-6 rounded-xl border border-border bg-card p-6">
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <pre className="overflow-x-auto rounded-lg bg-surface p-4 text-sm text-foreground">
        <code>{sql}</code>
      </pre>
    </div>
  );
}

function DataFlowDiagram() {
  return (
    <div className="my-8 flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8">
      <div className="text-center">
        <div className="inline-flex rounded-lg bg-ember-accent/20 px-4 py-2 font-mono text-sm text-ember-accent">
          SELECT * FROM resources
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          User sends query (no WHERE clause)
        </p>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-center">
        <div className="inline-flex rounded-lg bg-blue-500/20 px-4 py-2 font-mono text-sm text-blue-400">
          RLS Policy Check
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Database automatically filters by org_id
        </p>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-center">
        <div className="inline-flex rounded-lg bg-green-500/20 px-4 py-2 font-mono text-sm text-green-400">
          Only user&apos;s org data returned
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Other tenants&apos; data is invisible
        </p>
      </div>
    </div>
  );
}

export default function Post() {
  return (
    <article className="prose prose-lg prose-stone dark:prose-invert max-w-none">
      <h1>Interactive Demo: How Supabase RLS Protects Your Data</h1>

      <p>
        Row Level Security sounds abstract until you see it work. This post
        walks you through exactly what happens when a query hits a
        Supabase database protected by RLS policies. No theory - just the
        data flow.
      </p>

      <h2 className="mt-8 mb-4 border-l-2 border-ember-accent pl-3">
        The Query Journey
      </h2>

      <p>
        When your application runs a simple <code>SELECT * FROM resources</code>,
        here is what actually happens at the database level:
      </p>

      <DataFlowDiagram />

      <p>
        The magic is that your application code does not need a{" "}
        <code>WHERE org_id = ?</code> clause. The database adds it automatically
        based on the authenticated user&apos;s JWT token.
      </p>

      <h2 className="mt-8 mb-4 border-l-2 border-ember-accent pl-3">
        The Two Policies That Handle Everything
      </h2>

      <PolicyCard
        title="Read Policy"
        sql={`CREATE POLICY "Org members can read"
  ON resources FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM members
      WHERE user_id = auth.uid()
    )
  );`}
        description="This policy checks if the current user belongs to the same organization as the resource. If not, the row is invisible."
      />

      <PolicyCard
        title="Write Policy"
        sql={`CREATE POLICY "Org admins can write"
  ON resources FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM members
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );`}
        description="Write operations require admin or owner role within the organization. Regular members can read but not create resources."
      />

      <h2 className="mt-8 mb-4 border-l-2 border-ember-accent pl-3">
        Why This Matters for AI Applications
      </h2>

      <p>
        When an AI chatbot generates database queries, you cannot trust the
        query to include proper tenant isolation. The AI might generate{" "}
        <code>SELECT * FROM resources WHERE type = &apos;yoga_class&apos;</code>{" "}
        without any org filter. With RLS, it does not matter - the database
        enforces isolation regardless of what the query says.
      </p>

      <p>
        This is the difference between hoping your application code is correct
        and knowing your database enforces correctness. RLS is not optional for
        multi-tenant applications. It is the foundation.
      </p>

      <hr />

      <p>
        <em>
          Need RLS policies implemented for your Supabase project? I specialize
          in securing multi-tenant architectures.{" "}
          <a href="mailto:jay@orangec.at">Let&apos;s talk</a>.
        </em>
      </p>
    </article>
  );
}
