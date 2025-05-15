import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
  return (
    <div className="pt-5">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
        Create New Post
      </h2>
      <CreatePost />
    </div>
  );
};