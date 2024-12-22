import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSIdebar from "./RightSIdebar";
import useGetAllPosts from "@/hooks/useGetAllPosts";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

function Home() {
  useGetSuggestedUsers();
  useGetAllPosts();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RightSIdebar />
    </div>
  );
}

export default Home;
