import { TagOptions } from "@/components/TagOptions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "./fileUpload";

export function NewTargetFrom() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"lg"} variant="outline">
          Create target
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[850px] lg:max-h-[700px]">
        <DialogHeader>
          <DialogTitle>New Target info</DialogTitle>
          <DialogDescription>
            Enter the {`target's`} info to create a new target. We also support
            csv file for bulk upload.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-8 items-center gap-2">
            <Label htmlFor="name" className="col-span-1 text-center ">
              Name
            </Label>
            <Input id="name" placeholder="SN 2024ab" className="col-span-7" />
          </div>
          <div className="grid grid-cols-8 items-center gap-4">
            <Label htmlFor="ra" className="col-span-1 text-center">
              RA
            </Label>
            <Input id="ra" className="col-span-3" />
            <Label htmlFor="ra" className="col-span-1 text-center">
              Dec
            </Label>
            <Input id="dec" className="col-span-3" />
          </div>
        </div>
        <TagOptions />
        <FileUpload />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
