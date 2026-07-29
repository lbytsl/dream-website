declare module "../../data/recent-posts.json" {
  const posts: {
    title: string;
    date: string;
    slug: string;
    tags: string[];
    description: string;
  }[];
  export default posts;
}
