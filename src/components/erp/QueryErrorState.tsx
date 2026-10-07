import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ErpButton } from "./Button";

/**
 * Maps technical, network, timeout, and HTTP error codes to user-friendly messages.
 */
export function getFriendlyErrorMessage(error: unknown, fallback = "An unexpected error occurred while loading data."): string {
  if (!error) return fallback;

  let message = "";
  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
    message = (error as { message: string }).message;
  }

  const lower = message.toLowerCase();

  if (lower.includes("failed to fetch") || lower.includes("network") || lower.includes("err_connection") || lower.includes("offline")) {
    return "Unable to connect to the server. Please check your internet connection.";
  }
  if (lower.includes("timeout") || lower.includes("aborted") || lower.includes("abort")) {
    return "The server request timed out. Please try again.";
  }
  if (lower.includes("500") || lower.includes("internal server") || lower.includes("server error")) {
    return "The server encountered a temporary issue. Please retry in a moment.";
  }
  if (lower.includes("403") || lower.includes("unauthorized") || lower.includes("forbidden") || lower.includes("permission")) {
    return "You do not have permission to view or manage this financial resource.";
  }
  if (lower.includes("404") || lower.includes("not found")) {
    return "The requested record or resource was not found.";
  }

  return message && !lower.includes("object") ? message : fallback;
}

/**
 * Hook to trigger a toast.error on query error transition with friendly message mapping.
 */
export function useQueryErrorToast(
  isError: boolean,
  error: unknown,
  fallbackMessage = "Failed to load financial records."
) {
  useEffect(() => {
    if (isError) {
      const friendlyMsg = getFriendlyErrorMessage(error, fallbackMessage);
      toast.error(friendlyMsg);
    }
  }, [isError, error, fallbackMessage]);
}

interface QueryErrorStateProps {
  title?: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

export function QueryErrorState({
  title = "Unable to Load Data",
  description,
  error,
  onRetry,
  className = "",
}: QueryErrorStateProps) {
  const displayMessage = description || getFriendlyErrorMessage(error, "An unexpected error occurred while fetching information from the server.");

  return (
    <div
      role="alert"
      className={`card-soft flex flex-col items-center justify-center px-6 py-16 text-center border-dashed border-destructive/40 bg-destructive/5 ${className}`}
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{displayMessage}</p>
      {onRetry && (
        <div className="mt-5">
          <ErpButton variant="primary" size="md" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </ErpButton>
        </div>
      )}
    </div>
  );
}
