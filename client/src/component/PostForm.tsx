import { createPost, logOut } from "@/api/apifunctions";
import { newPost, Post } from "../interfaces/interfaces";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuthorized } from "../../hooks/useAuthorized";
import { Loading } from "./Loading";

export const UserComponent = () => {
  const router = useRouter();
  const isAuthorized = useAuthorized();

  const LogoutMutation = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      router.reload();
    },
  });
  if (isAuthorized.isLoading) return null

  if (!isAuthorized.data) return null;

  return (
    <div className="flex justify-between gap-3 py-4 px-3 w-full md:max-w-2xl mx-auto sticky top-0 z-50  border border-slate-600">
      <div className="text-slate-400">
        <h3>Welcome {isAuthorized.data?.username} </h3>
        <button
          className="border-red-400 hover:border-red-700 text-slate-400 text-sm  border rounded px-1 py-1  w-full "
          onClick={() => LogoutMutation.mutate()}
        >
          Logout
        </button>
      </div>
      <PostForm />
    </div>
  );
};

export const PostForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<newPost>();

  const queryClient = useQueryClient();

  const createPostQuery = useMutation({
    mutationFn: createPost,

    onMutate: (newPost) => {
      const prevPosts = queryClient.getQueryData<Post[]>("post_list");

      if (prevPosts) {
        const newPostWithids = {
          ...newPost,
          id: prevPosts.length + 1,
          user_id: prevPosts.length + 1,
        };
        const newData = [newPostWithids, ...prevPosts];
        queryClient.setQueryData<Post[]>("post_list", newData);
      }


      return { prevPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData("todos", context?.prevPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries("post_list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post_list"] });
    },
  });

  const onSubmit = (data: newPost) => {
    createPostQuery.mutate(data);
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex grow">
      <div className="flex flex-col w-full  mx-1 border-slate-600 border text-slate-300 text-sm">
        <input
          type="text"
          placeholder="title"
          {...register("title", { required: true })}
          className="outline-none p-2"
        />
        <input
          type="text"
          placeholder="content..."
          {...register("content", { required: true })}
          className="outline-none p-2"
        />
      </div>
      <div className="self-center">
        <input
          type="submit"
          value="Post"
          className="border-slate-400 text-slate-400 text-sm  border rounded px-1 py-1 w-full"
        />
      </div>
    </form>
  );
};
