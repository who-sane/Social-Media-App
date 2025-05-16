import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { Filter } from "bad-words";

interface CommunityInput {
  name: string;
  description: string;
}
const createCommunity = async (community: CommunityInput) => {
  const name = community.name.charAt(0).toUpperCase() + community.name.slice(1);

  const { data: existing, error: checkError } = await supabase
    .from("communities")
    .select("id")
    .ilike("name", name);
  if (checkError) throw new Error(checkError.message);
  if (existing && existing.length > 0) {
    throw new Error("A community with this name already exists.");
  }

  const { error, data } = await supabase.from("communities").insert({
    ...community,
    name,
  });
  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toastRef = useRef<HTMLDivElement>(null);
  const errorToastRef = useRef<HTMLDivElement>(null);
  const missingNameToastRef = useRef<HTMLDivElement>(null);
  const profanityToastRef = useRef<HTMLDivElement>(null);
  const filter = new Filter();

  const { mutate, isPending } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      if (toastRef.current) {
        toastRef.current.style.opacity = "1";
        setTimeout(() => {
          if (toastRef.current) toastRef.current.style.opacity = "0";
        }, 2000);
      }
      setName("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setTimeout(() => {
        navigate("/communities");
      }, 2000);
    },
    onError: (error) => {
      if (errorToastRef.current) {
        errorToastRef.current.textContent = error instanceof Error ? error.message : "Error creating community. Please try again.";
        errorToastRef.current.style.opacity = "1";
        setTimeout(() => {
          if (errorToastRef.current) errorToastRef.current.style.opacity = "0";
        }, 3000);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      if (missingNameToastRef.current) {
        missingNameToastRef.current.style.opacity = "1";
        setTimeout(() => {
          if (missingNameToastRef.current) missingNameToastRef.current.style.opacity = "0";
        }, 3000);
      }
      return;
    }
    if (filter.isProfane(name) || filter.isProfane(description)) {
      if (profanityToastRef.current) {
        profanityToastRef.current.style.opacity = "1";
        setTimeout(() => {
          if (profanityToastRef.current) profanityToastRef.current.style.opacity = "0";
        }, 3000);
      }
      return;
    }
    mutate({ name, description });
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
        Community created successfully!
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
        Error creating community. Please try again.
      </div>
      {/* Missing Name Toast Bar */}
      <div
        ref={missingNameToastRef}
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
        Please enter a community name before submitting.
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
        Profanity is not allowed in community name or description.
      </div>
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-rose-600 to-blue-500 bg-clip-text text-transparent">
        Create New Community
      </h2>
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Community Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-pink-300 bg-white text-gray-800 p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-sky-300 bg-white text-gray-800 p-2 rounded"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>
    </form>
  );
};