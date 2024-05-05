import React from 'react';

const Story = ({ story, isViewed }) => {
  const isImage = story.image_path != null;
  const isVideo = story.video_path != null;

  return (
    <div className={`rounded-full border border-dark w-32 h-32 overflow-hidden ${isViewed ? '' : 'bg-gradient-to-r p-[3px] from-pink-500 via-red-500 to-yellow-500'}`}>
      {isImage && (
        <img src={story.image_path} alt={story.description} className="object-cover w-full h-full rounded-full" />
      )}
      {isVideo && (
        <video src={story.video_path} alt={story.description} className="object-cover w-full h-full rounded-full" controls></video>
      )}
    </div>
  );
}

export default Story;
