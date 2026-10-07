import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetErrorBoundaryProps {
  widgetTitle?: string;
  className?: string;
  children: ReactNode;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Per-widget error boundary.
 *
 * Catches render-time exceptions inside a single widget so one broken
 * widget cannot take down the entire dashboard grid. Displays a compact
 * fallback that fits inside the same grid cell and offers a Retry button
 * that resets the boundary and re-mounts the widget content.
 */
export class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): WidgetErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      `[WidgetErrorBoundary] "${this.props.widgetTitle ?? "Unknown widget"}" crashed:`,
      error,
      info.componentStack,
    );
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className={cn(
            "card-soft flex h-full flex-col items-center justify-center gap-3 rounded-xl p-6 text-center",
            this.props.className,
          )}
        >
          <AlertTriangle className="h-8 w-8 text-destructive" />

          <div className="space-y-1">
            {this.props.widgetTitle && (
              <p className="text-sm font-semibold text-foreground">
                {this.props.widgetTitle}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This widget encountered an error and could not render.
            </p>
          </div>

          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
