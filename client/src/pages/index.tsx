import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createPost, getPosts, login, logOut } from "@/api/apifunctions";
import { useAuthorized } from "../../hooks/useAuthorized";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs/";
dayjs.extend(relativeTime);
import { useForm } from "react-hook-form";
import { Loading } from "../component/Loading";
import type { newPost, Post, User } from "./interfaces";
import Image from "next/image";

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

  const isAuthorized = useAuthorized();

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center  "
          >
            <div className="flex flex-col items-center justify-center space-y-6 border p-3 rounded mt-20 ">
              <h4 className="text-slate-300">LOGIN</h4>
              <input
                className="border-slate-400 border outline-none rounded text-slate-400 px-1 "
                type="text"
                placeholder="Username"
                {...register("username", { required: true })}
              />
              {errors.username && (
                <span className="text-red-400 self-start text-xs">
                  username field is required
                </span>
              )}
              <input
                className="border-slate-400 border  outline-none rounded text-slate-400 px-1 "
                type="text"
                placeholder="Password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-400 self-start text-xs">
                  password field is required
                </span>
              )}
              {loginMutation.isLoading ? (
                <Loading />
              ) : (
                <input
                  className="border-slate-400 text-slate-400 border rounded px-2 py-1 "
                  type="submit"
                  value="Login"
                />
              )}
            </div>
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

  const isAuthorized = useAuthorized();

  if (getPostQuery.isLoading) return <Loading />;

  return (
    <>
      {getPostQuery.data.map((post: Post) => {
        return (
          <div
            className="flex flex-col gap-2 py-4 border-y border-slate-700 p-2 w-full"
            key={post.id}
          >
            <div className="flex justify-between  text-sm font-medium text-slate-500">
              <div className="flex space-x-2">
                <h1>@{post.author?.username}</h1>
                <span>·</span>
                <h1>{dayjs().to(dayjs(post.createdAt))}</h1>
              </div>

              {isAuthorized.data?.username == post.author?.username ? (
                <div>
                  <Image
                    src={"trash.svg"}
                    alt={"trash"}
                    width={20}
                    height={20}
                  />
                </div>
              ) : null}
            </div>
            <div>
              <h3 className="text-md font-semibold text-slate-200">
                {post.title}
              </h3>
              <h4 className="text-sm text-slate-200">{post.content}</h4>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Home;
