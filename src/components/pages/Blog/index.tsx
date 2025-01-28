import Button from "@/components/Button";
import Header from "@/components/Header";
import MarkdownCmp from "@/components/MarkdownCmp";
import { BlogAPI } from "@/facades/apiCall";
import PostFactory from "@/factories/postFactory";
import Post from "@/models/post";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Blog = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>([PostFactory.default()]);
  const navigate = useNavigate();

  useEffect(() => {
    BlogAPI.getPosts()
      .then((postsData) => {
        // Reverse the array, make the last one comes first
        postsData.reverse();

        // TODO:Set posts to the postProvider
        // setGlobalPosts(postsData);

        // Paginate and lazyload the posts
        postsData.forEach((postData, index) => {
          BlogAPI.getPost(postData.id)
            .then((post: Post) => {
              setPosts((prevPosts: Post[]) => {
                const updatedPosts = [...prevPosts]; // Create a copy of the current state
                updatedPosts[index] = post; // Update the specific index
                return updatedPosts;
              });
            })
            .catch((error: any) => {
              console.error(`Failed to fetch post ${postData.id}:`, error);
            });
        });
      })
      .catch((error: any) => {
        console.error(
          `Something bad happened when trying to get the posts: ${error}`,
        );
      });
  }, []);
  const BlogHeader = (): JSX.Element => {
    return (
      <Header
        className="flex items-center w-full justify-between"
        bgColor="bg-cyan-500"
      >
        <div className="flex-initial min-h-12 table z-20">
          <p className="table-cell align-middle text-left">
            <strong>&lt;Blog0xe&gt;</strong>
          </p>
        </div>
        <div className="z-20 text-sm">
          Go to &nbsp;
          <Button
            onMouseDown={() => {
              navigate("/");
            }}
            className="px-1 py-1.5 mr-1 bg-cyan-900"
          >
            Terminal
          </Button>
        </div>
      </Header>
    );
  };
  const renderPosts = () => {
    return posts.map((post, index) => {
      return (
        <div
          className="min-h-32 bg-gray-800 sm:my-5 border-transparent sm:rounded-t-[20px] blog-post"
          key={`post#${index}`}
        >
          <div className="p-5">
            <strong>
              <p className="text-center border rounded px-5">
                {post.title ?? ""}{" "}
              </p>
            </strong>
          </div>
          <MarkdownCmp content={post.content ?? ""} />
          <div className="text-right text-xs pb-2 pr-2">
            created at {post.created_at.toString()}
          </div>
        </div>
      );
    });
  };
  return (
    <div className="text-white max-w-4xl m-auto">
      <BlogHeader />
      <div className="w-full sm:px-5 px-0">{renderPosts()}</div>
    </div>
  );
};

export default Blog;
