import React, {
  FormEvent,
  ReactEventHandler,
  useState,
  Suspense,
  useEffect,
} from "react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { checkAuth, login, logOut } from "@/api/apifunctions";
import { useForm } from "react-hook-form";

export interface User {
  username: string;
  password: string;
}

export interface CurrentUser {
  id: number;
  username: string;
}

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

  const isAuthorized = useQuery<CurrentUser>({
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
      console.log("Logged Out");

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
          <h5>Loading...</h5>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h4>Login</h4>
            <input type="text" {...register("username", { required: true })} />
            <input type="text" {...register("password", { required: true })} />
            {loginMutation.isLoading ? (
              <h5>loading...</h5>
            ) : (
              <input type="submit" value="Login" />
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <>
      <h3>Welcome {isAuthorized.data.username} </h3>
      <button onClick={() => LogoutMutation.mutate()}>LOGOUT</button>
    </>
  );
};

export const Loading = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};




export default Home;
