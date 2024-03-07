import { Target, TargetSimbad } from "@/models/targets";
import { getTargetSimbad } from "@/apis/targets";
import * as React from "react";
import Divider from "@mui/material/Divider";

type Props = {
  target?: Target | null;
};

export default function Detail(props: Props) {
  const [targetSimbad, setTargetSimbad] = React.useState<TargetSimbad | null>();

  React.useEffect(() => {
    if (props.target && props.target.id) {
      getTargetSimbad(props.target.id).then((targetSimbad) => {
        setTargetSimbad(targetSimbad);
      });
    }
  }, [props.target?.id, props.target]);

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
              Notes
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
              {props.target?.notes}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
