import {useInfiniteQuery} from "@tanstack/react-query";
import {fetchPosts} from "../api/posts.js";

export const usePosts = ({limit = 10}) => {
  return useInfiniteQuery({
    queryKey: ["posts", limit],
    queryFn: async  ({pageParam=0}) => {
      return await fetchPosts({limit, offset: pageParam})
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.posts.length < limit ) return undefined;

      return allPages.length * limit;
    }
  });
};
