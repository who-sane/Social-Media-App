import { PostList } from "../components/PostList";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCommunities, type Community } from "../components/CommunityList";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [communityFilter, setCommunityFilter] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  return (
    // main containter for home page 
    <div className="pt-1">
      <h3
        className="w-full text-3xl font-bold mb-6 text-center bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
        style={{ fontFamily: '"Pixelify Sans", monospace' }}
      >
        A Community <span>By Developers</span>, <span>For Developers</span>
      </h3>
      {/* search and filter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6 relative w-full max-w-3xl mx-auto">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search posts by title..."
            className="w-full border border-sky-300 bg-white text-gray-800 p-2 rounded-md pr-10 focus:ring-2 focus:ring-sky-400"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-600 hover:text-sky-800"
            onClick={() => setShowFilter(f => !f)}
            type="button"
            aria-label="Show filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18m-7.5 7.5h7.5m-18 0h7.5m-4.5 7.5h12" />
            </svg>
          </button>
          {showFilter && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-50 p-4">
              <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Filter by Community</label>
          <select
            className="w-full border border-gray-300 rounded p-1"
            value={communityFilter}
            onChange={e => setCommunityFilter(e.target.value)}
          >
            <option value="">All Communities</option>
            {communities
              ?.filter(c => c && c.id && c.name)
              .map(c => (
                <option key={c.id} value={c.id}>
            {c.name}
                </option>
              ))}
          </select>
              </div>
              <div>
          <label className="block text-sm font-medium mb-1">Sort by</label>
          <select
            className="w-full border border-gray-300 rounded p-1"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <PostList searchTerm={searchTerm} communityFilter={communityFilter} sortBy={sortBy} />
      </div>
    </div>
  );
};

