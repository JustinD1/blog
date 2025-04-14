export const TruncatedBlogCard = ({title, content}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm border mb-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600 mt-2">
        {content}
      </p>
    </div>
  );
}
