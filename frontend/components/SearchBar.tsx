import { Input } from "@/components/ui/input";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <Input
      placeholder={placeholder}
      className="text-primary-foreground h-8 w-[150px] lg:w-[250px]"
    />
  );
}
