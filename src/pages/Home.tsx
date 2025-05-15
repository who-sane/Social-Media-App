import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    // main containter for home page 
    <div className="pt-1">
      <h3
        className="text-3xl font-bold mb-6 text-center h-10 bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
        style={{ fontFamily: '"Pixelify Sans", monospace' }}
      >
        A Community <span>By Developers</span>, <span>For Developers</span>
      </h3>
      <div>
        <PostList />
      </div>
    </div>
  );
};

