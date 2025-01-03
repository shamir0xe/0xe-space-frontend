import Post from "../post";

const postDTO = (postData: any) => {
  return {
    id: postData.id,
    created_at: new Date(postData.created_at),
    updated_at: new Date(postData.updated_at),
    content: postData.content,
    title: postData.title,
    rating_avg: postData.rating_avg ?? -1,
  } as Post;
};

export default postDTO;
