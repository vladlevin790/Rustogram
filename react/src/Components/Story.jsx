export default function Story(imageSrc,altText,newStory){
  return (
    <div>
      { !newStory &&
        <div className="w-132 h-132 rounded-full border border-dark">
          <img src={imageSrc.imageSrc} alt={imageSrc.altText} className="rounded-full p-0"/>
        </div>
      }
      { newStory &&
        <div className="w-132 h-132 rounded-full border border-gradient">
          <img src={imageSrc.imageSrc} alt={imageSrc.altText} />
        </div>
      }
    </div>
  );

}
