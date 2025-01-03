import Post from "@/models/post";

export default class PostFactory {
  static default(): Post {
    return {
      id: Math.round(Math.random() * 12345).toString(),
      created_at: new Date(),
      updated_at: new Date(),
      title: "# Default Post",
      content: "## Please wait \nmaybe the server is down(?)",
      rating_avg: 5,
    } as Post;
  }
}
