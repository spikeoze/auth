import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createPost,
  deletePost,
  getPosts,
  login,
  logOut,
} from "@/api/apifunctions";
import { useAuthorized } from "../../hooks/useAuthorized";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs/";
dayjs.extend(relativeTime);
import { useForm } from "react-hook-form";
import { Loading, PageLoading } from "../component/Loading";
import type { newPost, Post, User } from "../interfaces/interfaces";
import Image from "next/image";
import Link from "next/link";

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


  const onSubmit = (data: User) => {
    loginMutation.mutate(data);
    reset();
  };

  if (!isAuthorized.data) {
    return (
      <div className="flex flex-col items-center">
        {isAuthorized.isLoading? (
          <PageLoading />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center"
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
                <PageLoading />
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
        <h2 className="text-slate-400">
          No account?{" "}
          <span className="text-blue-200 underline cursor-pointer">
            <Link href={"/register"}>Resgister Now</Link>
          </span>
        </h2>
      </div>
    );
  }

  return (
    <div className="border-x border-slate-700 ">
      <Posts />
    </div>
  );
};

export const Posts = () => {
  const queryClient = useQueryClient();

  const getPostQuery = useQuery({
    queryKey: ["post_list"],
    queryFn: getPosts,
  });

  const isAuthorized = useAuthorized();

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post_list"],
      });
    },
  });

  if (getPostQuery.isLoading) return <PageLoading />;

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
                deletePostMutation.isLoading ? (
                  <Image
                    src={"trash-gray.svg"}
                    height={20}
                    width={20}
                    alt={"delete grayed out"}
                  />
                ) : (
                  <div onClick={() => deletePostMutation.mutate(post.id)}>
                    <Image
                      src={"trash.svg"}
                      alt={"trash"}
                      width={20}
                      height={20}
                    />
                  </div>
                )
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
