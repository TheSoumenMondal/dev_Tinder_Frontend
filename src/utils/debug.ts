export const logAuthState = (user: any, pathname: string, action: string) => {
  if (process.env.NODE_ENV === "development") {
    console.group(`Auth Debug: ${action}`);
    console.log("Current Path:", pathname);
    console.log(
      "User State:",
      user ? `Logged in as ${user.firstName}` : "Not authenticated"
    );
    console.log("Timestamp:", new Date().toLocaleTimeString());
    console.groupEnd();
  }
};

export const logRouteChange = (from: string, to: string, reason: string) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Route Change: ${from} → ${to} (${reason})`);
  }
};
