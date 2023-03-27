import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "@/api/apifunctions";
import { CurrentUser } from "@/interfaces/interfaces";

export function useAuthorized() {
  return useQuery({
    queryKey: ["authorized"],
    queryFn: async (): Promise<CurrentUser> =>
      api.get("/auth/isauthorized").then((res) => res.data),
    retry: 0,
  });
}
