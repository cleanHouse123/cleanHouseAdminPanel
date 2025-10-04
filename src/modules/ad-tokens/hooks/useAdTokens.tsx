import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adTokensApi } from "../api";
import { CreateAdTokenRequest } from "../types";

export const useAdTokens = () => {
    return useQuery({
        queryKey: ["ad-tokens"],
        queryFn: adTokensApi.getAdTokens,
    });
};

export const useCreateAdToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAdTokenRequest) => adTokensApi.createAdToken(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ad-tokens"] });
        },
    });
};
