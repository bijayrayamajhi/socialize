import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSIdebar from "./RightSIdebar";
import useGetAllPosts from "@/hooks/useGetAllPosts";

function Home() {
  useGetAllPosts();
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSIdebar />
    </div>
  );
}

export default Home;
