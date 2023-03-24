import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  checkAuth,
  createPost,
  getPosts,
  login,
  logOut,
} from "@/api/apifunctions";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs/";
dayjs.extend(relativeTime);
import { useForm } from "react-hook-form";
import { Loading } from "../component/Loading";
import type { newPost, Post, User } from "./interfaces";

const Home: NextPage<User> = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<User>();

  const queryClient = useQueryClient();

  const isAuthorized = useQuery({
    queryKey: ["authorized"],
    queryFn: checkAuth,
    retry: 0,
  });

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authorized"],
      });
      router.reload();
    },
  });

  const LogoutMutation = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      router.reload();
    },
  });

  const onSubmit = (data: User) => {
    loginMutation.mutate(data);
    reset();
  };

  if (!isAuthorized.data) {
    return (
      <div>
        {isAuthorized.isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h4>Login</h4>
            <input
              className="border-slate-400 border  outline-none"
              type="text"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <span className="text-red-400">username field is required</span>
            )}
            <input
              className="border-slate-400 border  outline-none"
              type="text"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-400">password field is required</span>
            )}
            {loginMutation.isLoading ? (
              <Loading />
            ) : (
              <input
                className="border-slate-400 border rounded px-2 py-1 "
                type="submit"
                value="Login"
              />
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="border-x border-slate-700 ">
      <div className="flex justify-between gap-3 py-4 px-3">
        <div className="text-slate-400">
          <h3>Welcome {isAuthorized.data.username} </h3>
          <button
            className="border-red-400 hover:border-red-700 text-slate-400 text-sm  border rounded px-1 py-1  w-full "
            onClick={() => LogoutMutation.mutate()}
          >
            Logout
          </button>
        </div>
        <PostForm />
      </div>
      <Posts />
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
        const newData = [...prevPosts, newPostWithids];
        queryClient.setQueryData<Post[]>("post_list", newData);
      }

      console.log("Mutate");

      return { prevPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData("todos", context?.prevPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries("post_list");
    },
    onSuccess: () => {
      console.log("Success");

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

export const Posts = () => {
  const getPostQuery = useQuery({
    queryKey: ["post_list"],
    queryFn: getPosts,
  });

  if (getPostQuery.isLoading) return <Loading />;

  return (
    <>
      {getPostQuery.data.map((post: Post) => {
        return (
          <div
            className="flex flex-col gap-2 py-4 border-y border-slate-700 p-2 w-full"
            key={post.id}
          >
            <div className="flex space-x-2 text-sm font-medium text-slate-500">
              <h1>@{post.author?.username}</h1>
              <span>·</span>
              <h1>{dayjs(post.createdAt).toNow()}</h1>
            </div>
            <div>
              <h3 className="text-md font-semibold text-slate-200">{post.title}</h3>
              <h4 className="text-sm text-slate-200">{post.content}</h4>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Home;
