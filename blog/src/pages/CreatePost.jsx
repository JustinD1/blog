import {SinglePageTemplate} from "../template/SinglePageTemplate.jsx";
import {useState} from "react";
import dayjs from "dayjs";
import {useAuth} from "../context/AuthContext.jsx";
import {createPost} from "../api/posts.js";

export const CreatePost = () => {
  const {user, axios} = useAuth()
  const [title, setTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [author, setAuthor] = useState(user.surname + ", " + user.forename);
  const [isDraft, setIsDraft] = useState(true);
  const [publishAt, setPublishAt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      blogContent,
      author,
      is_draft: isDraft,
      publish_at: !isDraft && publishAt ? dayjs(publishAt).toISOString() : null,
    };

    try {
      const response = createPost(payload)
      console.log(response)
      // alert("Post created successfully!");
      // setTitle("");
      // setBlogContent("");
      // setAuthor("");
      // setIsDraft(true);
      // setPublishAt("");
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    }
  };

  const content = () => {
    return (
      <main className="flex-1 p-6 rounded-tl-3xl contentContainer">
        <form onSubmit={(handleSubmit)}
              className="space-y-4 max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded shadow">
          <h2 className="text-xl font-bold">Create New Post</h2>

          <p className="text-sm text-gray-500">Title:</p>
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <p className="text-sm text-gray-500">Content:</p>
          <textarea
            placeholder="Content"
            className="w-full border rounded p-2 h-40"
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            required
          />

          <p className="text-sm text-gray-500">Author:</p>
          <input
            type="text"
            placeholder="Author"
            className="w-full border rounded p-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled
            required
          />

          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500">Is Draft:</p>
            <input
              type="checkbox"
              checked={isDraft}
              onChange={() => setIsDraft(!isDraft)}
              id="isDraft"
            />
            <label htmlFor="isDraft">Save as Draft</label>
          </div>

          {!isDraft && (
            <input
              type="datetime-local"
              className="w-full border rounded p-2"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </main>
    )
  }
  return <SinglePageTemplate content={content()}/>
}
