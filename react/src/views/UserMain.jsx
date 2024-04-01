import React, { useEffect, useState } from "react";
import Post from "../Components/Post.jsx";
import Story from "../Components/Story.jsx";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import {Navigate, useNavigate} from "react-router-dom";
import toast, {Toaster} from "react-hot-toast";

export default function UserMain() {
  const [newStory, setNewStory] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const { user } = useStateContext();
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  axiosClient.get('user_main').then(({data})=>{
    if(data.birthday == undefined || data.birthday == null) {
      navigate('/user_insert_update');
    }
  })

  const fetchData = async () => {
    try
    {
      const [postsResponse, likesResponse] = await Promise.all([
        axiosClient.get('/posts'),
        axiosClient.get('/getLikes')
      ]);

      const posts = postsResponse.data.map(post => ({
        ...post,
        isLiked: false
      }));

      const likes = likesResponse.data.likes;
      setPostsData(posts);
      setLikesData(likes);
    }
    catch (error)
    {
      console.error('Error fetching data:', error);
    }
  };

  const updatePostsList = (postId) => {
    setPostsData(postsData => postsData.filter(post => post.id !== postId));
  };

  const updatePostDescription = (postId, postBio) => {
    setPostsData(postsData =>
      postsData.map(post => {
        const updatedPost = post.id === postId ? { ...post, description: postBio } : post;
        console.log(updatedPost);
        return updatedPost;
      })
    );
  };


  const handleLikeClick = async (postId) => {
    try {
      const hasLiked = likesData.some(like => like.post && like.post.id === postId && like.user.id === user.id);
      const endpoint = hasLiked ? '/unlike' : '/like';
      const response = await axiosClient.post(endpoint, { post_id: postId });

      if (response.status === 200) {
        setPostsData(postsData =>
          postsData.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likes: hasLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !hasLiked,
              };
            }
            return post;
          })
        );
        setLikesData(prevLikesData => {
          const updatedLikesData = hasLiked
            ? prevLikesData.filter(like => !(like.post && like.post.id === postId))
            : [...prevLikesData, { id: postId, user: user, post: { id: postId } }];
          return updatedLikesData;
        });
      } else {
        toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
      }
    } catch (error) {
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="flex mt-[26px] mb-[7px] border-b w-[1299px] ">
        <div className="ml-[45px] flex gap-[45px] p-2">
          <Story imageSrc="https://placekitten.com/101/101" altText="kitty" newStory={newStory} />
          <Story imageSrc="https://placekitten.com/101/101" altText="kitty" newStory={newStory} />
          <Story imageSrc="https://placekitten.com/101/101" altText="kitty" newStory={newStory} />
        </div>
      </header>
      <main>
        {postsData.map(post => (
          <Post key={post.id} post={post} onLikeClick={handleLikeClick} likesData={likesData} user={user} isOwner={post.user.id == user.id} updatePostsList={updatePostsList} updatePostDescription={updatePostDescription} />
        ))}
      </main>
      <Toaster />
    </div>
  );
}
