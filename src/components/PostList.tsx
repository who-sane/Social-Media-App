import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);

  return data as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <span className="text-xl font-semibold text-gray-300 mb-2">
          Loading posts
        </span>
        <span className="flex space-x-1 text-3xl font-bold animate-blink">
          <span className="animate-blink delay-0">.</span>
          <span className="animate-blink delay-150">.</span>
          <span className="animate-blink delay-300">.</span>
        </span>
      </div>
    );
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  console.log(data);

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
};