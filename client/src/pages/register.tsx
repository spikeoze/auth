/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useForm } from "react-hook-form";
import { User } from "../interfaces/interfaces";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { registerUser } from "@/api/apifunctions";
import { useRouter } from "next/router";
import { Loading } from "@/component/Loading";

export function register() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<User>();

  const router = useRouter();
  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      router.push("/");
    },
  });

  const onSubmit = (data: User) => {
    registerMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center"
    >
      <div className="flex flex-col items-center justify-center space-y-6 border p-3 rounded mt-20 ">
        <h4 className="text-slate-300">Register</h4>
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
        {registerMutation.isLoading ? (
          <Loading />
        ) : (
          <input
            className="border-slate-400 text-slate-400 border rounded px-2 py-1 "
            type="submit"
            value="Register"
          />
        )}
      </div>
    </form>
  );
}

export default register;
