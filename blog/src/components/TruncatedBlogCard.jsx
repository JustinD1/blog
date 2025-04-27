export const TruncatedBlogCard = ({title, content}) => {
  const truncatedBlogCardContent = content.length > 100 ? content.slice(0,100) + "..." : content
  return (
    <div className="flex flex-col items-center">
     <div className="bg-white shadow-md rounded-lg p-4 border mb-2 w-full max-w-2xl">
      <h2 className="text-cyan-700 text-xl font-bold">{title}</h2>
      <p className="text-gray-600 mt-2">
        {truncatedBlogCardContent}
      </p>
    </div>
   </div>
  );
}
