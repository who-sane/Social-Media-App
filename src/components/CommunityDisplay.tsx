import { useQuery } from "@tanstack/react-query";
import { type Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
};

// circumnavigate the type error
const fetchCommunityName = async (communityId: number): Promise<string> => {
  const { data, error } = await supabase
    .from("communities")
    .select("name")
    .eq("id", communityId)
    .single();
  if (error) return "";
  return data?.name || "";
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  const { data: communityName, isLoading: isNameLoading } = useQuery<string>({
    queryKey: ["communityName", communityId],
    queryFn: () => fetchCommunityName(communityId),
  });

  if (isLoading || isNameLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <span className="text-xl font-semibold text-gray-300 mb-2">
          Loading communities
        </span>
        <span className="flex space-x-1 text-3xl font-bold animate-blink">
          <span className="animate-blink delay-0">.</span>
          <span className="animate-blink delay-150">.</span>
          <span className="animate-blink delay-300">.</span>
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-stone-500 to-pink-500 bg-clip-text text-transparent">
        {communityName ? `${communityName}'s Community Posts` : "Community Posts"}
      </h2>
      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
};