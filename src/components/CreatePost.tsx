import { type ChangeEvent, useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { type Community, fetchCommunities } from "./CommunityList";
import { useNavigate } from "react-router";
import { Filter } from "bad-words";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  // Capitalize first letter of title
  const title = post.title.charAt(0).toUpperCase() + post.title.slice(1);

  const filePath = `${title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, title, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityId, setCommunityId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const errorToastRef = useRef<HTMLDivElement>(null);
  const missingImageToastRef = useRef<HTMLDivElement>(null);
  const profanityToastRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const filter = new Filter();

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      if (toastRef.current) {
        toastRef.current.style.opacity = "1";
        setTimeout(() => {
          if (toastRef.current) toastRef.current.style.opacity = "0";
        }, 2000);
      }
      setTitle("");
      setContent("");
      setCommunityId(null);
      setSelectedFile(null);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: () => {
      if (errorToastRef.current) {
        errorToastRef.current.style.opacity = "1";
        setTimeout(() => {
          if (errorToastRef.current) errorToastRef.current.style.opacity = "0";
        }, 3000);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      if (missingImageToastRef.current) {
        missingImageToastRef.current.style.opacity = "1";
        setTimeout(() => {
          if (missingImageToastRef.current) missingImageToastRef.current.style.opacity = "0";
        }, 3000);
      }
      return;
    }
    if (filter.isProfane(title) || filter.isProfane(content)) {
      if (profanityToastRef.current) {
        profanityToastRef.current.style.opacity = "1";
        setTimeout(() => {
          if (profanityToastRef.current) profanityToastRef.current.style.opacity = "0";
        }, 3000);
      }
      return;
    }
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      {/* Success Toast Bar */}
      <div
        ref={toastRef}
        style={{
          opacity: 0,
          transition: "opacity 0.5s",
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
        className="bg-green-600 text-white px-4 py-2 rounded shadow-lg"
      >
        Post created successfully!
      </div>
      {/* Error Toast Bar */}
      <div
        ref={errorToastRef}
        style={{
          opacity: 0,
          transition: "opacity 0.5s",
          position: "fixed",
          top: 70,
          right: 20,
          zIndex: 1000,
        }}
        className="bg-red-600 text-white px-4 py-2 rounded shadow-lg"
      >
        Error creating post. Please try again.
      </div>
      {/* Missing Image Toast Bar */}
      <div
        ref={missingImageToastRef}
        style={{
          opacity: 0,
          transition: "opacity 0.5s",
          position: "fixed",
          top: 120,
          right: 20,
          zIndex: 1000,
        }}
        className="bg-yellow-500 text-white px-4 py-2 rounded shadow-lg"
      >
        Please select an image before submitting.
      </div>
      {/* Profanity Toast Bar */}
      <div
        ref={profanityToastRef}
        style={{
          opacity: 0,
          transition: "opacity 0.5s",
          position: "fixed",
          top: 170,
          right: 20,
          zIndex: 1000,
        }}
        className="bg-[#BC4B51] text-white px-4 py-2 rounded shadow-lg"
      >
        Profanity is not allowed in post title or content.
      </div>

      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-pink-300 bg-white text-gray-800 p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-sky-300 bg-white text-gray-800 p-2 rounded"
          rows={5}
          required
        />
      </div>

      <div>
        <select
          id="community"
          onChange={handleCommunityChange}
          className="w-60 border border-white/10 bg-rose-700 text-gray-200 p-2 rounded focus:outline-none cursor-pointer focus:ring-2 focus:ring-purple-500 "
        >
          <option value={""}> -- Choose a Community -- </option>
          {communities?.map((community, key) => (
            <option
              key={key}
              value={community.id}
              className="bg-gray-900 text-gray-200"
            >
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-52 text-gray-200 bg-sky-700 border border-white/10 p-2 rounded focus:outline-none cursor-pointer focus:ring-2 focus:ring-purple-500 "
        />
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
};