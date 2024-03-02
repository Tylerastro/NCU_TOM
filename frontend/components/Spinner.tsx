import { ImSpinner3 } from "react-icons/im";

export default function Spinner() {
  return (
    <div role="status">
      <ImSpinner3 className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-200" />
    </div>
  );
}
