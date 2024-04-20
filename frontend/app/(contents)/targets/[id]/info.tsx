import { useEffect, useState } from "react";
import { Target, TargetSimbad } from "@/models/targets";
import { getTargetSimbad } from "@/apis/targets";
import Divider from "@mui/material/Divider";
import ScatterSED from "./scatterSED";
import Aladin from "./aladin";
import Simbad from "./simbad";

type Props = {
  target?: Target | null;
};

declare global {
  interface Window {
    A: any; // Replace 'any' with a more specific type if available
  }
}

export default function Info(props: Props) {
  const [targetSimbad, setTargetSimbad] = useState<TargetSimbad | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.target && props.target.id) {
      getTargetSimbad(props.target.id)
        .then((targetSimbad) => {
          setTargetSimbad(targetSimbad);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [props.target?.id, props.target]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Location
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              Ra:{props.target?.ra.toFixed(3)} Dec:
              {props.target?.dec.toFixed(3)}{" "}
              <Divider orientation="vertical" variant="middle" flexItem />{" "}
              Coordinate [hms:dms]: {props.target?.coordinates}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Tags
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              {props.target?.tags?.map((tag, index) => (
                <span key={index}>{tag.name}</span>
              ))}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Simbad info
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              <Simbad targetSimbad={targetSimbad} />
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Views
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              <React.Suspense fallback={<div>Loading...</div>}>
                <Aladin target={props.target} />
              </React.Suspense>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">NED</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              NED model
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-200">
              Photometric info
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              <ScatterSED id={props.target?.id || 0} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
