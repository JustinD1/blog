import {SinglePageTemplate} from "../template/SinglePageTemplate.jsx";
import {Fragment, useState} from "react";
import {usePosts} from "../hooks/posts.js";
import {FormatStandardUK, isFuture} from "../utility/DateTime.js";
import {UserViewType} from "../enums/UserViewTypes.js";

export const AdminView = () => {
  const [selectedPost, setSelectedPost] = useState(null)
  const [offset, setOffset] = useState(0)
  const limit = 50;
  const {
    data,
    isLoading,
    error
  } = usePosts({limit: limit, offset: offset, view: UserViewType.AdminView});

  const handleNext = () => setOffset(prev => prev + limit);
  const handlePrev = () => setOffset(prev => Math.max(0, prev - limit));

  const posts = data?.posts;
  const tableHeaders = [
    {title: "Publish Date"},
    {title: "Date Created"},
    {title: "Title"},
  ]

  const rowStyleSelector = (row) => {
    if (row?.is_draft) {
      return "bg-blue-400 text-white"
    }
    if (row?.publish_at.Valid) {
      const isFuturePublished = isFuture({datetime: row?.publish_at.Time});
      if (isFuturePublished) {
        return "bg-amber-400"
      }
      return "bg-green-400"
    }
    return "bg-gray-400"
  }

  const content = () => {
    return (
      <main className="flex-1 p-6 rounded-tl-3xl h-auto min-h-fit contentContainer">
        <h1 className="text-2xl font-bold mb-2">Admin View</h1>

        {isLoading && (<p>Loading...</p>)}
        {error && (<p>Error loading posts!</p>)}

        {!isLoading && !error && (
          <Fragment>
            <table className="table table-striped min-w-full table-auto border-gray-300">
              <thead className="bg-gray-200 rounded-t-2xl">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={"table-header-" + index}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">{header.title}</th>
                ))}
              </tr>
              </thead>
              <tbody>
              {posts?.map((post, i) => (
                <tr key={post?.id}
                    className={"p-3 hover:opacity-100 " + (i % 2 ? " opacity-80 " : " opacity-90 ") + rowStyleSelector(post)}>
                  <td className={"px-4 py-2 border-b"}>{post?.publish_at.Valid ?
                    <FormatStandardUK datetime={post?.publish_at.Time}/> : ""}</td>
                  <td className={"px-4 py-2 border-b"}>{post?.created_at ?
                    <FormatStandardUK datetime={post?.created_at}/> : ""}</td>
                  <td className={"px-4 py-2 border-b"}>{post?.title}</td>
                </tr>
              ))}
              </tbody>
            </table>
            <div className={"w-full inline-flex items-center justify-between"}>
              <button className={"bg-gray-400 rounded-md m-2 w-1/4 min-h-10"} type={"button"} onClick={handlePrev}
                      disabled={offset === 0}>Previous
              </button>
              <button className={"bg-gray-400 rounded-md m-2 w-1/4 min-h-10"} type={"button"} onClick={handleNext}
                      disabled={data?.posts.length < limit}>Next
              </button>
            </div>
          </Fragment>
        )}
      </main>
    );
  }
  return <SinglePageTemplate content={content()}/>;
};
