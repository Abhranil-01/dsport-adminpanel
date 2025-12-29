

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../lib/socket";
import { fetchDataFromApi } from "../Services/fetchDataFromApi";

export const useOrderSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // Admin room
    socket.emit("JOIN_ADMIN");

    const onOrderEvent = (payload) => {
      console.log("📦 ORDER EVENT:", payload);

      // ✅ ONLY invalidate LIST (IMPORTANT)
      dispatch(
        fetchDataFromApi.util.invalidateTags([
          { type: "Orders", id: "LIST" },
        ])
      );
    };

    socket.on("ORDER_CREATED", onOrderEvent);
    socket.on("ORDER_UPDATED", onOrderEvent);

    return () => {
      socket.off("ORDER_CREATED", onOrderEvent);
      socket.off("ORDER_UPDATED", onOrderEvent);
    };
  }, [dispatch]);
};
