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
  community_id?: number;
}

interface PostListProps {
  searchTerm?: string;
  communityFilter?: string;
  sortBy?: string;
}

const fetchPosts = async (communityFilter?: string): Promise<Post[]> => {
  let query = supabase.rpc("get_posts_with_counts");
  if (communityFilter) {
    query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("community_id", communityFilter)
      .order("created_at", { ascending: false });
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Post[];
  } else {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Post[];
  }
};

export const PostList = ({
  searchTerm = "",
  communityFilter = "",
  sortBy = "date_desc",
}: PostListProps) => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts", communityFilter],
    queryFn: () => fetchPosts(communityFilter),
  });

  let filtered = data ?? [];
  if (searchTerm) {
    filtered = filtered.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (sortBy === "date_asc") {
    filtered = filtered
      .slice()
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  } else {
    filtered = filtered
      .slice()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

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

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 text-xl font-semibold bg-white rounded p-4 w-full">
          No posts found.
        </div>
      ) : (
        filtered.map((post, key) => <PostItem post={post} key={key} />)
      )}
    </div>
  );
};