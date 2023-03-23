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

  const isAuthorized = useQuery<User | UseQueryResult>({
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
    },
  });

  const LogoutMutation = useMutation({
    mutationFn: logOut,

    onSuccess: () => {
      console.log("Logged Out");

      router.reload();
    },
  });

  if (isAuthorized.isLoading) <h4>Loading...</h4>;

  const onSubmit = (data: User) => {
    loginMutation.mutate(data);

    reset();
  };

  if (isAuthorized.isError) {
    return (
      <div>
        <h4>Login</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" {...register("username", { required: true })} />
          <input type="text" {...register("password", { required: true })} />
          {loginMutation.isLoading ? (
            <h4>loading...</h4>
          ) : (
            <input type="submit" value="Login" />
          )}
        </form>
      </div>
    );
  }

  return (
    <>
      <h3>You are logged in</h3>
      <button onClick={() => LogoutMutation.mutate()}>LOGOUT</button>
    </>
  );
};

// Home.getInitialProps = async () => {
//   const user = await checkAuth();
//   return user;
// };

export default Home;
