import { Transition } from "@headlessui/react";
import { Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { useTimeoutFn } from "react-use";

export default function Switch({
  viewset,
  setViewset,
}: {
  viewset: string;
  setViewset: React.Dispatch<React.SetStateAction<string>>;
}) {
  let [isShowing, setIsShowing] = useState(true);
  let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);
  const [display, setDisplay] = React.useState(viewset);

  const toggleDisplay = () => {
    const newViewset = display === "Observations" ? "Lulin" : "Observations";
    setViewset(newViewset);
    setIsShowing(false);
    resetIsShowing();
    useTimeoutFn;
    setTimeout(() => {
      setDisplay(newViewset);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center py-8 text-primary-foreground">
      <Transition
        show={isShowing}
        enter="transform transition duration-&lsqb;400ms&rsqb;"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
        <div
          className="text-2xl font-semibold"
          onClick={() => {
            setIsShowing(false);
            resetIsShowing();
          }}
        >
          <Typography variant="h4">
            <button
              onClick={() => {
                setIsShowing(false);
                resetIsShowing();
                toggleDisplay();
              }}
            >
              {display}
            </button>
          </Typography>
        </div>
      </Transition>
    </div>
  );
}
