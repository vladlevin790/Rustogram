import React, { useEffect, useState } from 'react';

export default function Comment({ comment }) {
  const [isAvatar, setAvatar] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');
  const [isContentExpanded, setContentExpanded] = useState(false);

  useEffect(() => {
    if (comment.user.avatar != null) {
      setAvatar(true);
    } else {
      setAvatar(false);
    }

    const timestamp = new Date(comment.created_at);
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime - timestamp) / 1000);

    let formattedTimeString = '';

    if (timeDifferenceInSeconds < 60) {
      formattedTimeString = 'только что';
    } else if (timeDifferenceInSeconds < 3600) {
      const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
      formattedTimeString = `${minutesAgo} минут${getMinutesSuffix(minutesAgo)} назад`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
      formattedTimeString = `${hoursAgo} час${getHoursSuffix(hoursAgo)} назад`;
    } else {
      const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
      formattedTimeString = `${daysAgo} д${getDaysSuffix(daysAgo)} назад`;
    }

    setFormattedTime(formattedTimeString);
  }, [comment.created_at, comment.user.avatar]);

  const getMinutesSuffix = (minutes) => {
    if (minutes === 1) {
      return 'у';
    } else if (minutes >= 2 && minutes <= 4) {
      return 'ы';
    } else {
      return '';
    }
  };

  const getHoursSuffix = (hours) => {
    if (hours === 1) {
      return '';
    } else {
      return 'а';
    }
  };

  const getDaysSuffix = (days) => {
    if (days === 1) {
      return 'ень';
    } else if (days >= 2 && days <= 4) {
      return 'ня';
    } else {
      return 'ней';
    }
  };

  return (
    <div className="flex items-center mb-4 rounded w-full bg-comment p-4 justify-between">
      <div className="flex">
        <div className="flex-shrink-0">
            {!isAvatar && (<img className="w-[37px] h-[39px]" src="../../src/media/icons/user.png" alt="" />)}
            {isAvatar && (<img className="w-[40px] h-[40px] rounded-full" src={comment.user.avatar} alt="" />)}
        </div>
        <div className="ml-4 font-roboto">
          <h2 className="text-sm font-bold text-gray-900">{comment.user.name}</h2>
          <p className="text-sm text-gray-500 ">{formattedTime}</p>
        </div>
      </div>
      <p className="text-sm max-w-[100px] overflow-hidden overflow-ellipsis">
        <span className="whitespace-normal break-words font-semibold font-roboto mr-5 text-xl">{comment.content}</span>
      </p>
    </div>
  );
}
