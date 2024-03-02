"use client";
import { useVerifyMutation } from "@/redux/features/authApiSlice";
import { finishLoading, login } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hook";
import * as React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Setup() {
  const [verify] = useVerifyMutation();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    verify(undefined)
      .unwrap()
      .then(() => {
        dispatch(login());
      })
      .finally(() => {
        dispatch(finishLoading());
      });
  }, [verify, dispatch]);

  return <ToastContainer />;
}
