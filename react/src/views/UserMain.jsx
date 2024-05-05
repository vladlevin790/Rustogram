import React, { useEffect, useState } from "react";
import Post from "../Components/Post.jsx";
import Story from "../Components/Story.jsx";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function UserMain() {
  const [postsData, setPostsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const { user } = useStateContext();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [storyData, setStoryData] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [currentTab, setCurrentTab] = useState("myFeed");
  const [viewedStories, setViewedStories] = useState([]);
  const navigate = useNavigate();

  axiosClient.get('user_main').then(({ data }) => {
    if (data.birthday == undefined || data.birthday == null) {
      navigate('/user_insert_update');
    }
  });

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
      // toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
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
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };
  const fetchDataStories = async () => {
    try {
      let response;
      if (currentTab === "myFeed") {
        response = await axiosClient.get(`/stories/subscription/${user.id}`);
      } else if (currentTab === "recommendations") {
        response = await axiosClient.get('/stories');
      }
      setStoryData(response.data);
    } catch (error) {
      // toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}});
    }
  };

  const fetchViewedStories = async () => {
    try {
      const response = await axiosClient.get(`/stories/looked/${user.id}`);
      setViewedStories(response.data.looked_stories);
    } catch (error) {
      // toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };

  async function fetchDataComments(postId) {
    try {
      const response = await axiosClient.get(`/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      // toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  }
  const handleCommentSubmit = async (postId, postUserId) => {
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
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
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

  const handleStoryClick = (story, index) => {
    if (!viewedStories || !viewedStories.includes) {
      return;
    }
    if (!viewedStories.includes(story.id)) {
      axiosClient.post(`/stories/look/${user.id}/${story.id}`);
      setViewedStories([...viewedStories, story.id]);
    }
    setSelectedStory(story);
    setSelectedStoryIndex(index);
  };
  const handleStoryChange =  (direction) => {
    const newIndex = selectedStoryIndex + direction;
    if (newIndex >= 0 && newIndex < storyData.length) {
      const nextStory = storyData[newIndex];
      if (!viewedStories.includes(nextStory.id)) {
        try {
          axiosClient.post(`/stories/look/${user.id}/${nextStory.id}`);
          setViewedStories([...viewedStories, nextStory.id]);
        } catch (error) {
          toast("Что-то пошло не так", {style: {background: "#FDA0A0", fontFamily: "Roboto", fontSize: '20px', color: 'white'}});
        }
      }
      setSelectedStory(nextStory);
      setSelectedStoryIndex(newIndex);
    }
  };

  const handleStoryDelete = async (storyId) => {
    try {
      await axiosClient.delete(`/stories/delete/${storyId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`,
        }
      });
      setStoryData(storyData.filter(story => story.id !== storyId));
      setSelectedStory(null);
      setSelectedStoryIndex(null);
      toast("История успешно удалена", {style: {background: "#6EE7B7", fontFamily: "Roboto", fontSize: '20px', color: 'white'}});
    } catch (error) {
      toast("Что-то пошло не так при удалении истории", {style: {background: "#FDA0A0", fontFamily: "Roboto", fontSize: '20px', color: 'white'}});
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      if(user){
        await fetchData();
        await fetchDataComments();
        await fetchDataStories();
        await fetchViewedStories();
      }
    };

    fetchDataAsync();
  }, [user, currentTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [postsData]);

  return (
    <div className="flex flex-col justify-center items-center">
      <header className="flex mt-[26px] mb-[7px] border-b w-[1299px] ">
        <div className="ml-[45px] flex gap-[45px] p-2">
          {storyData.length > 0 && storyData.map((story, index) => {
            const previousStory = index > 0 ? storyData[index - 1] : null;
            const isSameUser = previousStory && previousStory.user.id === story.user.id;
            const isViewed = viewedStories ? viewedStories.includes(story.id) : false;

            if (isSameUser) {
              return null;
            } else {
              return (
                <div className="relative cursor-pointer">
                  <Story key={story.id} story={story} isViewed={isViewed}/>
                  <button className="absolute top-0 left-0 w-full h-full  "
                          onClick={() => handleStoryClick(story, index)}></button>
                </div>
              );
            }
          })}
        </div>
        {selectedStory && (
          <div className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-10"
               onClick={(e) => {
                 if (e.target === e.currentTarget) {
                   setSelectedStory(null);
                 }
               }}>
            <div className="max-w-2xl mx-auto bg-white  rounded">

              {selectedStory.image_path && (
                <img src={selectedStory.image_path} alt="Story" className="object-cover h-[691px] w-[770px] mb-4"/>
              )}
              {selectedStory.video_path && (
                <video controls src={selectedStory.video_path}
                       className="object-cover h-[691px] w-[770px] mb-4"></video>
              )}
              <h2 className="text-xl font-bold mb-4 ml-4">Описание: {selectedStory.description}</h2>
              <h2 className="text-xl font-bold mb-4 ml-4">Пользователь: {selectedStory.user.name}</h2>
              {(selectedStory.user.id === user.id || user.is_admin === 1) &&
                (<button onClick={() => handleStoryDelete(selectedStory.id)}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-4 mb-2">Удалить</button>)}
              <button
                className="absolute top-[50%] left-[30%] w-12  bg-gray-400 flex justify-center p-2 rounded-full ml-2 opacity-50"
                onClick={() => handleStoryChange(-1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="absolute top-[50%] right-[30%] w-12  bg-gray-400 flex justify-center p-2 rounded-full mr-2 opacity-50"
                onClick={() => handleStoryChange(1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </header>
      <div className="flex gap-20 justify-center border-b w-[1299px] mb-6">
        <button className={currentTab == "myFeed" ? 'mb-2 font-roboto text-3xl text-black' : 'mb-2 font-roboto text-3xl text-gray-300 transition-all' } onClick={()=>setCurrentTab('myFeed')}>Моя лента</button>
        <button className={currentTab == "recommendations" ? 'mb-2 font-roboto text-3xl text-black' : 'mb-2 font-roboto text-3xl text-gray-300 transition-all' } onClick={()=>setCurrentTab('recommendations')}>Рекомендации</button>
      </div>
      <main>
        {postsData.map(post => (
          <Post key={post.id} post={post} onLikeClick={handleLikeClick} likesData={likesData} user={user} isOwner={post.user.id == user.id || user.is_admin == 1} updatePostsList={updatePostsList} updatePostDescription={updatePostDescription} updatePostImagesOrVideosNumbered={updatePostImagesOrVideosNumbered} comments={comments} setComments={setComments} handleCommentSubmit={handleCommentSubmit} newCommentText={newCommentText} setNewCommentText={setNewCommentText}/>
        ))}
      </main>
      <Toaster />
    </div>
  );
}
