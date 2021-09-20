import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BlogPost, ListResponse } from "./types";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["BlogPost"],
  endpoints: (builder) => ({
    getBlogPosts: builder.query<ListResponse<BlogPost>, number | void>({
      query: (page = 1) => `posts?page=${page}`,
      // transformResponse: (response: { data: BlogPost[] }) => response.data,
      // providesTags: ["BlogPost"],
    }),
    addBlogPost: builder.mutation<BlogPost, Omit<BlogPost, "id">>({
      query: (body) => ({
        url: `posts`,
        method: "POST",
        body,
      }),
      // invalidatesTags: ["BlogPost"],
    }),
    updateBlogPost: builder.mutation<
      BlogPost,
      Partial<BlogPost> & Pick<BlogPost, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: patch,
      }),
      // invalidatesTags: ["BlogPost"],
    }),
    deleteBlogPost: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => {
        return {
          url: `posts/${id}`,
          method: "DELETE",
        };
      },
      // invalidatesTags: ["BlogPost"],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useAddBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
