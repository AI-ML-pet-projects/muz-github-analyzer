import toast, { ToastPosition } from "react-hot-toast";

type NotificationStyle = {
  background: string;
  color: string;
  duration: number;
};

const POSITIONS = {
  TOP_CENTER: "top-center" as ToastPosition,
  TOP_RIGHT: "top-right" as ToastPosition,
  TOP_LEFT: "top-left" as ToastPosition,
  BOTTOM_CENTER: "bottom-center" as ToastPosition,
  BOTTOM_RIGHT: "bottom-right" as ToastPosition,
  BOTTOM_LEFT: "bottom-left" as ToastPosition,
} as const;

const STYLES = {
  SUCCESS: {
    background: "#10B981", // Green
    color: "#FFFFFF",
    duration: 2000,
  },
  ERROR: {
    background: "#EF4444", // Red
    color: "#FFFFFF",
    duration: 3000,
  },
  WARNING: {
    background: "#F59E0B", // Yellow
    color: "#FFFFFF",
    duration: 3000,
  },
  INFO: {
    background: "#3B82F6", // Blue
    color: "#FFFFFF",
    duration: 2000,
  },
} as const;

const createToast = (
  message: string,
  style: NotificationStyle,
  position: ToastPosition = POSITIONS.TOP_CENTER
) => {
  return toast(message, {
    duration: style.duration,
    position,
    style: {
      background: style.background,
      color: style.color,
      padding: "12px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
  });
};

export const notify = {
  success: (message: string, position?: ToastPosition) =>
    createToast(message, STYLES.SUCCESS, position),

  error: (message: string, position?: ToastPosition) =>
    createToast(message, STYLES.ERROR, position),

  warning: (message: string, position?: ToastPosition) =>
    createToast(message, STYLES.WARNING, position),

  info: (message: string, position?: ToastPosition) =>
    createToast(message, STYLES.INFO, position),

  // Predefined messages for API operations
  api: {
    success: (operation: string) =>
      notify.success(`${operation} completed successfully`),
    error: (operation: string) =>
      notify.error(`Failed to ${operation}. Please try again.`),
    loading: (message: string) =>
      toast.loading(message, {
        position: POSITIONS.TOP_CENTER,
        style: {
          background: "#1F2937",
          color: "#FFFFFF",
          padding: "12px 16px",
          borderRadius: "6px",
        },
      }),
  },

  // Predefined messages for API key operations
  apiKey: {
    copy: () => notify.success("API key copied to clipboard"),
    create: () => notify.success("API key created successfully"),
    update: () => notify.success("API key updated successfully"),
    delete: () => notify.success("API key deleted successfully"),
    error: (operation: string) =>
      notify.error(`Failed to ${operation} API key. Please try again.`),
    validate: {
      success: () => notify.success("API key is valid"),
      error: () => notify.error("Invalid API key. Please check and try again."),
    },
  },

  // Predefined messages for auth operations
  auth: {
    login: {
      success: () => notify.success("Logged in successfully"),
      error: () => notify.error("Failed to log in. Please try again."),
    },
    logout: {
      success: () => notify.success("Logged out successfully"),
      error: () => notify.error("Failed to log out. Please try again."),
    },
    signup: {
      success: () => notify.success("Account created successfully"),
      error: () => notify.error("Failed to create account. Please try again."),
    },
  },

  // Dismiss all toasts
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};
