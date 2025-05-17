import { useQuery } from "@tanstack/react-query";
import { type Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { useState } from "react";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  const [previewOpen, setPreviewOpen] = useState(false);

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-sky-500 to-purple-400 bg-clip-text text-transparent h-full pb-2">
        {data?.title}
      </h2>
      {data?.image_url && (
        <>
          <img
            src={data.image_url}
            alt={data?.title}
            className="mt-4 rounded object-cover w-full h-full max-h-80 cursor-pointer transition-transform duration-200 hover:scale-102 hover:shadow-2xl"
            onClick={() => setPreviewOpen(true)}
            title="Click to preview"
          />
          {previewOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
              onClick={() => setPreviewOpen(false)}
            >
              <img
                src={data.image_url}
                alt={data?.title}
                className="max-w-3xl max-h-[80vh] rounded-lg shadow-2xl border-4 border-white transition-transform duration-200 hover:scale-105"
                onClick={e => e.stopPropagation()}
              />
              <button
                className="absolute top-8 right-8 text-white text-3xl font-bold bg-black/60 rounded-full px-4 py-2 hover:bg-[#BC4B51] transition-colors"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
              >
                &times;
              </button>
            </div>
          )}
        </>
      )}
      <h3 className="text-black-400 text-2xl">{data?.content}</h3>
      <p className="text-black-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>

      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};