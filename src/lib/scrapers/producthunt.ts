import type { SaasRow } from "../supabase";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomSpark(): number[] {
  return Array.from({ length: 16 }, () => 30 + Math.floor(Math.random() * 70));
}

const QUERY = `
  query {
    posts(order: VOTES, first: 50) {
      edges {
        node {
          id
          name
          tagline
          url
          votesCount
          topics { edges { node { name } } }
        }
      }
    }
  }
`;

export async function scrapeProductHunt(): Promise<Partial<SaasRow>[]> {
  const apiKey = process.env["PRODUCTHUNT_API_KEY"];
  if (!apiKey) throw new Error("PRODUCTHUNT_API_KEY not set");

  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query: QUERY }),
  });

  if (!res.ok) throw new Error(`ProductHunt API error: ${res.status}`);

  const json = await res.json() as {
    data: {
      posts: {
        edges: Array<{
          node: {
            name: string;
            tagline: string;
            url: string;
            votesCount: number;
            topics: { edges: Array<{ node: { name: string } }> };
          };
        }>;
      };
    };
  };

  return json.data.posts.edges.map(({ node }) => ({
    id: slugify(node.name),
    name: node.name,
    tagline: node.tagline,
    category: node.topics.edges[0]?.node.name ?? "Product",
    source: "ProductHunt" as const,
    url: node.url,
    growth: node.votesCount,
    spark: randomSpark(),
  }));
}
