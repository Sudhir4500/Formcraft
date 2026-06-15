import { ApiError } from "@/types/api";

export function useApiErrorHandler() {
    function parseError(error: unknown) {
        const err = error as ApiError;
        return {
            message: err.message || "something went wrong",
            validationErrors: err.errors || {},
        };
    }
    return { parseError }
}