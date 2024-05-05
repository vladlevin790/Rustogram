
export default function  UserProfilePost({ post })  {
  const isImage = post.image_path !== null;
  const isVideo = post.video_path !== null;
  return(
    <div className="rounded w-[430px] h-[374px] border border-gray-100 transition-all hover:opacity-30 hover:cursor-pointer">
      {isImage && (<img src={post.image_path} alt="" className="w-[430px] h-[374px] rounded object-cover"/>)}
      {isVideo && (<video src={post.video_path} controls className="w-[430px] h-[374px] rounded object-cover"></video>)}
    </div>
  )
}
