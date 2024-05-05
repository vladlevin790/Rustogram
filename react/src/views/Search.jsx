import React, {useEffect, useState} from 'react';
import SearchIcon from "../Components/SearchIcon.jsx";
import axiosClient from "../axios-client.js";
import toast from "react-hot-toast";
import Post from "../Components/Post.jsx";
import {useStateContext} from "../context/ContextProvider.jsx";
import Story from "../Components/Story.jsx";

export default function Search() {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [likesData, setLikesData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [storyData,setStoryData] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [viewedStories, setViewedStories] = useState([]);
  const { user } = useStateContext();

  const handleSearch = async () => {
    try {
      const response = await axiosClient.get(`posts/search/${username}`);
      const likesResponse = await axiosClient.get('/getLikes');
      const likes = likesResponse.data.likes;
      const post = response.data.map(post => ({
        ...post,
        isLiked: false
      }));
      setLikesData(likes);
      setPosts(post);
      setError('');
      post.forEach(post => {
        fetchDataComments(post.id);
      });
    } catch (error) {
      setError(error);
      console.error(error);
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
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };

  const handleLikeClick = async (postId) => {
    try {
      const hasLiked = likesData.some(like => like.post && like.post.id === postId && like.user.id === user.id);
      const endpoint = hasLiked ? '/unlike' : '/like';
      const response = await axiosClient.post(endpoint, { post_id: postId });

      if (response.status === 200) {
        setPosts(postsData =>
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

  const updatePostsList = (postId) => {
    setPosts(postsData => postsData.filter(post => post.id !== postId));
  };

  const updatePostDescription = (postId, postBio) => {
    setPosts(postsData => postsData.map(
      post => {
        const updatedPost = post.id === postId ? { ...post, description: postBio } : post;
        return updatedPost;
      })
    );
  };

  const updatePostImagesOrVideosNumbered = async (postId) => {
    try {
      const response = await axiosClient.get(`posts/select_post/${postId}`);
      setPosts(postsData.map(post => (post.id === postId ? response.data : post)));
    } catch (error) {
      toast("Что-то пошло не так",{style:{background:"#FDA0A0", fontFamily:"Roboto", fontSize:'20px', color:'white'}})
    }
  };

  const fetchDataStories = async () => {
    try {
      const response = await axiosClient.get('/stories');
      console.log(response)
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

  const handleStoryClick = (story, index) => {
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

  useEffect(() => {
    const fetchDataAsync = async () => {
      if(user){
        await fetchDataStories();
        await fetchViewedStories();
      }
    };
    fetchDataAsync();
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center font-roboto">
      <header className="flex flex-col border-b-2 w-[1300px]">
        <article className="border-b-2 ">
          <div className="ml-[45px] flex gap-[45px] p-2">
            {storyData.length > 0 && storyData.map((story, index) => {
              const previousStory = index > 0 ? storyData[index - 1] : null;
              const isSameUser = previousStory && previousStory.user.id === story.user.id;
              const isViewed = viewedStories.includes(story.id);

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
        </article>
        {selectedStory && (
          <article className="fixed inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center z-10"
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
          </article>
        )}
        <article className="flex justify-center items-center mt-5 mb-5">
          <div className="flex gap-2 bg-gray-200 p-2 rounded-xl">
            <button onClick={handleSearch}><SearchIcon /></button>
            <input
              type="text"
              className="bg-transparent py-2 px-4"
              placeholder="Поиск по постам пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </article>
      </header>
      <main className="flex flex-col mt-4 gap-10">
        {posts.map(post => (
          <Post key={post.id} post={post} onLikeClick={handleLikeClick} likesData={likesData} user={user} isOwner={post.user.id == user.id || user.is_admin == 1} updatePostsList={updatePostsList} updatePostDescription={updatePostDescription} updatePostImagesOrVideosNumbered={updatePostImagesOrVideosNumbered} comments={comments} setComments={setComments} handleCommentSubmit={handleCommentSubmit} newCommentText={newCommentText} setNewCommentText={setNewCommentText}/>
        ))}
      </main>
    </div>
  );
}
