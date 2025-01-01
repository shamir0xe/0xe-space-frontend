type Post = {
	id: string;
	created_at: Date;
	updated_at: Date;
	title: string | null;
	content: string | null;
	rating_avg: number | null;
};

export default Post;
