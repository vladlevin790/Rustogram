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
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCreateStory, setIsCreateStory] = useState(false);
  const [storyData,setStoryData] = useState([]);
  const [storyImage, setStoryImage] = useState(null);
  const [storyVideo, setStoryVideo] = useState(null);
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentTab, setCurrentTab] = useState("myFeed");
  const navigate = useNavigate();

  axiosClient.get('user_main').then(({data})=>{
    if(data.birthday == undefined || data.birthday == null) {
      navigate('/user_insert_update');
    }
  })
  const fetchData = async () => {
    try {
      let postsResponse;
      if (currentTab === "myFeed") {
        postsResponse = await axiosClient.get(`/posts/subscription/${user.id}`);
      } else if (currentTab === "recommendations") {
        postsResponse = await axiosClient.get('/posts');
      }

      const likesResponse = await axiosClient.get('/getLikes');

      const posts = postsResponse.data.map(post => ({
        ...post,
        isLiked: false
      }));

      const likes = likesResponse.data.likes;
      setPostsData(posts);
      setLikesData(likes);
      posts.forEach(post => {
        fetchDataComments(post.id);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updatePostsList = (postId) => {
    setPostsData(postsData => postsData.filter(post => post.id !== postId));
  };

  const updatePostDescription = (postId, postBio) => {
    setPostsData(postsData => postsData.map(
      post => {
        const updatedPost = post.id === postId ? { ...post, description: postBio } : post;
        return updatedPost;
      })
    );
  };

  const updatePostImagesOrVideosNumbered = async (postId) => {
    try {
      const response = await axiosClient.get(`posts/select_post/${postId}`);
      setPostsData(postsData.map(post => (post.id === postId ? response.data : post)));
    } catch (error) {
      toast("Произошла ошибка при обновлении поста");
    }
  };
  const fetchDataStories = async () => {
    try {
      const response = await axiosClient.get('/stories');
      setStoryData(response.data);
    } catch (error) {
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };

  async function fetchDataComments(postId) {
    try {
      const response = await axiosClient.get(`/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }
  const handleCommentSubmit = async (postId,postUserId) => {
    try {
      const response = await axiosClient.post(`/posts/${postId}/comments`, {
        user_id: postUserId,
        post_id: postId,
        content: newCommentText,
      });
      const updatedComments = await axiosClient.get(`/posts/${postId}/comments`);
      setComments(updatedComments.data);
      setNewCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
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
    if(user){
      fetchData();
      fetchDataComments();
      fetchDataStories();
    }
  }, [user, currentTab]);

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="flex mt-[26px] mb-[7px] border-b w-[1299px] ">
        <div className="ml-[45px] flex gap-[45px] p-2">
          {storyData.map((story) => (
            <Story key={story.id} story={story}/>)
          )}
        </div>
      </header>
      <div className="flex gap-20 justify-center border-b w-[1299px] mb-6">
        <button className="mb-2 font-roboto text-3xl" onClick={()=>setCurrentTab('myFeed')}>Моя лента</button>
        <button className="mb-2 font-roboto text-3xl" onClick={()=>setCurrentTab('recommendations')}>Рекомендации</button>
      </div>
      <main>
        {postsData.map(post => (
          <Post key={post.id} post={post} onLikeClick={handleLikeClick} likesData={likesData} user={user} isOwner={post.user.id == user.id} updatePostsList={updatePostsList} updatePostDescription={updatePostDescription} updatePostImagesOrVideosNumbered={updatePostImagesOrVideosNumbered} comments={comments} setComments={setComments} handleCommentSubmit={handleCommentSubmit} newCommentText={newCommentText} setNewCommentText={setNewCommentText}/>
        ))}
      </main>
      <Toaster />
    </div>
  );
}
