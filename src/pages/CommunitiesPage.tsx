import { CommunityList } from "../components/CommunityList";

export const CommunitiesPage = () => {
  return (
    <div className="pt-5">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-teal-500 to-fuschia-500 bg-clip-text text-transparent">
        Communities
      </h2>
      <CommunityList />
    </div>
  );
};