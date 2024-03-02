import { TargetSimbad } from "@/models/targets";
type Props = {
  targetSimbad: TargetSimbad | null | undefined;
};

export default function Simbad(props: Props) {
  return (
    <>
      {props.targetSimbad?.flux_U && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#4704cde1] ring-1 ring-inset ring-gray-500/10">
          U: {props.targetSimbad.flux_U.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_u && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#1f04cde1] ring-1 ring-inset ring-gray-500/10">
          u: {props.targetSimbad.flux_u.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_B && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#1c05effa] ring-1 ring-inset ring-gray-500/10">
          B: {props.targetSimbad.flux_B.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_g && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#052ceffa] ring-1 ring-inset ring-gray-500/10">
          g: {props.targetSimbad.flux_g.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_V && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#0a8af2fa] ring-1 ring-inset ring-gray-500/10">
          V: {props.targetSimbad.flux_V.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_R && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#08efd8fa] ring-1 ring-inset ring-gray-500/10">
          R: {props.targetSimbad.flux_R.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_r && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#07f63f] ring-1 ring-inset ring-gray-500/10">
          r: {props.targetSimbad.flux_r.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_I && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#719700fa] ring-1 ring-inset ring-gray-500/10">
          I: {props.targetSimbad.flux_I.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_U && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#90961bfa] ring-1 ring-inset ring-gray-500/10">
          i: {props.targetSimbad.flux_U.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_J && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#f08606fa] ring-1 ring-inset ring-gray-500/10">
          J: {props.targetSimbad.flux_J.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_H && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#ef9d05fa] ring-1 ring-inset ring-gray-500/10">
          H: {props.targetSimbad.flux_H.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_K && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#ef0505fa] ring-1 ring-inset ring-gray-500/10">
          K: {props.targetSimbad.flux_K.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.flux_z && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#920404fa] ring-1 ring-inset ring-gray-500/10">
          z: {props.targetSimbad.flux_z.toFixed(2)}
        </span>
      )}
      {props.targetSimbad?.morphtype && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#170045e1] ring-1 ring-inset ring-gray-500/10">
          Morphology: {props.targetSimbad.morphtype}
        </span>
      )}
      {props.targetSimbad?.otype && (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-[#170045e1] ring-1 ring-inset ring-gray-500/10">
          Type: {props.targetSimbad.otype}
        </span>
      )}
    </>
  );
}
