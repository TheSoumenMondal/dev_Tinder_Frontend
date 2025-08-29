import envConfig from "@/config/envConfig";
import io from "socket.io-client";

export const createSocketConnection = () => {
  const base = envConfig.SOCKET_URL;
  return io(base, {
    transports: ["websocket", "polling" ],
  });
};
