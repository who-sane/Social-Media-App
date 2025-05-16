import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

interface CommunityListProps {
  searchTerm?: string;
}

export const CommunityList = ({ searchTerm = "" }: CommunityListProps) => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  // fetch post counts for each community
  const { data: postCounts } = useQuery<{ community_id: number; count: number }[], Error>({
    queryKey: ["communityPostCounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("community_id")
        .not("community_id", "is", null);
      if (error) throw new Error(error.message);
      const counts: { [key: number]: number } = {};
      data?.forEach((row: any) => {
        if (row.community_id) {
          counts[row.community_id] = (counts[row.community_id] || 0) + 1;
        }
      });
      return Object.entries(counts).map(([community_id, count]) => ({ community_id: Number(community_id), count }));
    },
  });

  let filtered = data ?? [];
  if (searchTerm) {
    filtered = filtered.filter((community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {filtered && filtered.length === 0 ? (
        <div className="text-center text-gray-400 text-xl font-semibold bg-white rounded p-4">
          No communities found.
        </div>
      ) : (
        filtered?.map((community) => {
          const postCount = postCounts?.find((c) => c.community_id === community.id)?.count || 0;
          return (
            <div
              key={community.id}
              className="border border-sky-500 p-4 rounded bg-white/80 hover:-translate-y-1 transition transform"
            >
              <div className="flex items-center justify-between">
                <Link
                  to={`/community/${community.id}`}
                  className="text-2xl font-bold text-sky-700 hover:underline"
                >
                  {community.name}
                </Link>
                <span className="text-sm text-gray-600 bg-sky-100 px-2 py-1 rounded-full ml-2">
                  {postCount} {postCount === 1 ? "post" : "posts"}
                </span>
              </div>
              <p className="text-gray-700 mt-2 text-base font-medium">
                {community.description}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};