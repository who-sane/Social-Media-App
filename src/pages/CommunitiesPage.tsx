import { useState } from "react";
import { CommunityList } from "../components/CommunityList";

export const CommunitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="pt-5">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
        Communities
      </h2>
      <div className="flex justify-center mb-6 w-full max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search communities by name..."
          className="w-full border border-sky-300 bg-white text-gray-800 p-2 rounded-md focus:ring-2 focus:ring-sky-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CommunityList searchTerm={searchTerm} />
    </div>
  );
};