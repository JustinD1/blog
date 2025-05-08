import {Fragment, useEffect, useState} from "react";
import {SinglePageTemplate} from "../template/SinglePageTemplate.jsx";
import {useParams} from "react-router-dom";
import {fetchPostByUuid} from "../api/posts.js";

export const Post = () => {
  const {uuid} = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await fetchPostByUuid({uuid}); // Fetch the post data by ID
        setPost(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [uuid]);

  const content = () => {
    if (isLoading) {
      return (
        <main className={"flex-1 p-6 rounded-tl-3xl contentContainer"}>
          <p>Loading...</p>
        </main>
      )
    }

    if (error) {
      return (
        <main className={"flex-1 p-6 rounded-tl-3xl contentContainer"}>
          <p>{error}</p>
        </main>
      )
    }
    return (
      <Fragment>
        <main className={"flex-1 p-6 rounded-tl-3xl contentContainer"}>
          <h2>{post?.title}</h2>
          <p className={"p-2"}>{post?.content}</p>
          <p className={"p-2"}>{post?.author}</p>
          <p className={"p-2"}>{post?.publish}</p>
        </main>
      </Fragment>
    )
  }
  return <SinglePageTemplate content={content()}/>;
}
