import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import SuperJSON from "superjson";
import { AppRouter } from "~/server/api/root";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        retry: (failureCount, error) => {
          const trpcError = error as TRPCClientError<AppRouter>; // Replace `AppRouter` with your router type
          const trpcErrorCode = trpcError?.data?.code;
          // Don't retry for UNAUTHORIZED errors
          if (trpcErrorCode === "UNAUTHORIZED") {
            return false;
          }
          // Retry other errors up to 3 times (default)
          return failureCount < 3;
        },
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
