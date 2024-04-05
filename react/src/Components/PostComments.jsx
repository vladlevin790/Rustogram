import React, { useState, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Comment from './Comment';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function PostComments({ postComments }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollbarsRef = useRef(null);

  const handleScrollStart = () => {
    setIsScrolling(true);
  };

  const handleScrollStop = () => {
    setIsScrolling(false);
  };

  const handleWheel = (e) => {
    if (isScrolling) {
      e.stopPropagation();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Scrollbars
        style={{ width: '100%', height: 400 }}
        ref={scrollbarsRef}
        onFocus={handleScrollStart}
        onBlur={handleScrollStop}
        onWheel={handleWheel}
      >
        <div className="flex flex-col items-center w-full p-4">
        {postComments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
        </div>
      </Scrollbars>
    </div>
  );
}
