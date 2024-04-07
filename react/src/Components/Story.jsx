import React from 'react';

const Story = ({ story }) => {
  const isImage = story.image_path != null;
  const isVideo = story.video_path != null;

  return (
    <div className="rounded-full border border-dark w-32 h-32 overflow-hidden">
      {isImage && (
        <img src={story.image_path} alt={story.description} className="object-cover w-full h-full"/>
      )}
      {isVideo && (
        <video src={story.video_path} alt={story.description} className="w-full h-full" controls></video>
      )}
    </div>
  );
}

export default Story;
