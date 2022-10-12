import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

const ProfileFollowing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState();
  let { username } = useParams();

  useEffect(() => {
    async function fethcPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/following`);
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error("There was a problem");
      }
    }
    fethcPosts();
  }, [username]);

  if (isLoading) return <LoadingIcon />;

  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
            key={index}
          >
            <img className="avatar-tiny" src={follower.avatar} />{" "}
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowing;
