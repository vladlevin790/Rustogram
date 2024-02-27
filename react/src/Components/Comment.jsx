import React, {useEffect, useState} from 'react';

export default function Comment({ comment }) {
  const [isAvatar,setAvatar] = useState(false);
  useEffect(()=>{
      if (comment.user.avatar != null)
      {
        setAvatar(true)
      }
      else
      {
        setAvatar(false)
      }
  },[isAvatar,setAvatar])
  return (
    <div className="flex items-center mb-4 border">
      <div className="flex-shrink-0">
        {isAvatar ? <img src={post.user.avatar} alt="" /> : <img src="../../src/media/icons/user.svg" className="h-[39px] w-[37px]" />}
      </div>
      <div className="ml-4">
        <h2 className="text-sm font-medium text-gray-900">{comment.user.name}</h2>
        <p className="text-sm text-gray-500">{comment.content}</p>
      </div>
    </div>
  );
}
