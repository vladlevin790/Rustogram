import axiosClient from "../axios-client.js";
import React, {useEffect, useState} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import toast from "react-hot-toast";
import Post from "../Components/Post.jsx";

export default function Explore(){
  const [postsData, setPostsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const { user } = useStateContext();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  const fetchData = async () => {
    try {
      let postsResponse = await axiosClient.get('/posts');
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
    const fetchDataAsync = async () => {
      if(user){
        await fetchData();
        await fetchDataComments();
      }
    };
    fetchDataAsync();
  }, [user]);

    return (
      <main className="flex flex-col justify-center items-center w-[1299px] gap-10 p-5">
        {postsData.map(post => (
          <Post key={post.id} post={post} onLikeClick={handleLikeClick} likesData={likesData} user={user}
                isOwner={post.user.id == user.id || user.is_admin == 1} updatePostsList={updatePostsList}
                updatePostDescription={updatePostDescription}
                updatePostImagesOrVideosNumbered={updatePostImagesOrVideosNumbered} comments={comments}
                setComments={setComments} handleCommentSubmit={handleCommentSubmit} newCommentText={newCommentText}
                setNewCommentText={setNewCommentText}/>
        ))}
      </main>
    )
}
