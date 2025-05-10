import {fetchPosts, fetchPostsAdmin} from "../api/posts.js";
import {UserViewType} from "../enums/UserViewTypes.js";
import {useQuery} from "@tanstack/react-query";

export const usePosts = ({limit = 10, offset = 0, view = UserViewType.PublicView}) => {
  return useQuery({
      queryKey: ["posts", limit, offset],
      queryFn: async () => {
        const pagination = {limit: limit, offset: offset};
        switch (view) {
          case UserViewType.AdminView:
            return await fetchPostsAdmin(pagination);

          case UserViewType.PublicView:
            return await fetchPosts(pagination);

          default: {
            console.error("Unknown view", view);
            return null;
          }
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || !Array.isArray(lastPage.posts)) {
          console.warn("Unexpected response shape:", lastPage);
          return undefined;
        }

        if (lastPage.posts.length < limit) {
          return undefined;
        }

        return allPages.reduce((acc, page) => acc + page.posts.length, 0);
      }
    }
  );
};
