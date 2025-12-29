import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../lib/socket";
import { fetchDataFromApi } from "../Services/fetchDataFromApi";

export const useReviewSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("JOIN_ADMIN");

    const onReviewEvent = (payload) => {
      console.log("⭐ REVIEW EVENT:", payload);

      if (!payload?.productcolorId) return;

      dispatch(
        fetchDataFromApi.util.invalidateTags([
          { type: "Products", id: payload.productcolorId },
        ])
      );
    };

    socket.on("REVIEW_CREATED", onReviewEvent);
    socket.on("REVIEW_UPDATED", onReviewEvent);
    socket.on("REVIEW_DELETED", onReviewEvent);

    return () => {
      socket.off("REVIEW_CREATED", onReviewEvent);
      socket.off("REVIEW_UPDATED", onReviewEvent);
      socket.off("REVIEW_DELETED", onReviewEvent);
    };
  }, [dispatch]);
};

