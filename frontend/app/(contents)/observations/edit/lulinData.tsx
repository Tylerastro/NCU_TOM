import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LulinRunUpdate, LulinRuns } from "@/models/observations";
import { createLulin } from "@/apis/observations/createLulin";
import { Files, CircleX } from "lucide-react";
import gsap from "gsap";
import * as React from "react";
import { TargetLulinForm } from "./lulinForm";
import { toast } from "react-toastify";
import { useEffect, useMemo, useRef, useState } from "react";
import { deleteLulin } from "@/apis/observations/deleteLulinRun";
import InputCell from "./InputTableCell";
import { LulinFilter, LulinInstrument } from "@/models/enums";
import SelectCell from "./SelectTableCell";
import { putLulinRun } from "@/apis/observations/putLulin";
interface LulinDataProps {
  observation_id: number;
  data: LulinRuns[];
  setCodeUpdate: React.Dispatch<boolean>;
  refetch: () => void;
}

export default function LulinData(props: LulinDataProps) {
  const { setCodeUpdate, ...otherProps } = props;
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const sortedData = useMemo(() => {
    return [...props.data].sort((a, b) => {
      const nameComparison = a.target.name.localeCompare(b.target.name);
      if (nameComparison !== 0) return nameComparison;
      return a.filter - b.filter;
    });
  }, [props.data]);

  useEffect(() => {
    if (sortedData.length === 0) return;

    const timeoutId = setTimeout(() => {
      const validRefs = rowRefs.current;
      if (validRefs.length > 0) {
        gsap.fromTo(
          validRefs,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
          }
        );
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [sortedData]);

  const handleDelete = async (rowData: LulinRuns) => {
    try {
      await deleteLulin(rowData.id);
      toast.success("Run deleted successfully");
      props.refetch();
    } catch (error: any) {
      if (error.data) {
        for (const key in error.data) {
          toast.error(`${key}: ${error.data[key][0]}`);
        }
      } else {
        toast.error("Failed to delete the run");
      }
      console.error("Error deleting row:", error);
    }
  };

  const handleUpdateRow = async (updatedData: LulinRuns) => {
    const updatePayload: LulinRunUpdate = {
      id: updatedData.id,
      exposure_time: updatedData.exposure_time,
      priority: updatedData.priority,
      filter: updatedData.filter,
      binning: updatedData.binning,
      frames: updatedData.frames,
      instrument: updatedData.instrument,
    };

    await putLulinRun(updatedData.id, updatePayload)
      .then(() => {
        setCodeUpdate(true);
        toast.success("Data updated successfully");
        props.refetch();
      })
      .catch((error) => {
        console.log(error);
        for (const key in error.data) {
          console.log(key, error.data[key]);
          toast.error(`${key}: ${error.data[key][0]}`);
        }
      });
  };

  const handleDuplicate = async (rowData: LulinRuns) => {
    try {
      const duplicateData = {
        targets: [rowData.target.id],
        priority: rowData.priority,
        filter: (rowData.filter % 5) + 1,
        binning: rowData.binning,
        frames: rowData.frames,
        instrument: rowData.instrument,
        exposure_time: rowData.exposure_time,
        start_date: new Date(rowData.start_date),
        end_date: new Date(rowData.end_date),
      };

      await createLulin(props.observation_id, duplicateData);
      toast.success("Observation duplicated successfully");
      props.refetch();
    } catch (error: any) {
      if (error.data) {
        for (const key in error.data) {
          toast.error(`${key}: ${error.data[key][0]}`);
        }
      } else {
        toast.error("Failed to duplicate the observation");
      }
      console.error("Error duplicating row:", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[75px] text-center">Delete</TableHead>
          <TableHead className="w-[75px] text-center">Duplicate</TableHead>
          <TableHead className="w-[100px] text-center">Target</TableHead>
          <TableHead className="text-center">Ra</TableHead>
          <TableHead className="text-center">Dec</TableHead>
          <TableHead className="text-center">Exposure time</TableHead>
          <TableHead className="text-center">Binning</TableHead>
          <TableHead className="text-center">Frames</TableHead>
          <TableHead className="text-center">Instrument</TableHead>
          <TableHead className="text-center">Filters</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((data, index) => (
          <TableRow
            key={data.id}
            ref={(el) => (rowRefs.current[index] = el)}
            style={{ opacity: 0 }}
          >
            <TableCell className="text-center items-center justify-center">
              <div className="flex justify-center">
                <CircleX
                  className="cursor-pointer hover:text-red-500 duration-300"
                  onClick={() => handleDelete(data)}
                />
              </div>
            </TableCell>
            <TableCell className="text-center  items-center justify-center">
              <div className="flex justify-center">
                <Files
                  className="cursor-pointer hover:text-blue-500 duration-300"
                  onClick={() => handleDuplicate(data)}
                />
              </div>
            </TableCell>
            <TableCell className="text-center items-center justify-center">
              <span className="prevent-select">{data.target.name}</span>
            </TableCell>
            <TableCell className="text-center items-center justify-center">
              <span className="prevent-select">{data.target.ra}</span>
            </TableCell>
            <TableCell className="text-center items-center justify-center">
              <span className="prevent-select">{data.target.dec}</span>
            </TableCell>
            <TableCell className="text-center items-center justify-center">
              <InputCell
                value={Number(data.exposure_time)}
                onUpdate={(newValue) =>
                  handleUpdateRow({
                    ...data,
                    exposure_time: Number(newValue),
                  })
                }
              >
                <span>{data.exposure_time}</span>
              </InputCell>
            </TableCell>
            <TableCell className="text-center items-center justify-center">
              <InputCell
                value={data.binning}
                onUpdate={(newValue) =>
                  handleUpdateRow({
                    ...data,
                    binning: Number(newValue),
                  })
                }
              >
                <span>{data.binning}</span>
              </InputCell>
            </TableCell>
            <TableCell className="text-center items-center justify-center">
              <InputCell
                value={data.frames}
                onUpdate={(newValue) =>
                  handleUpdateRow({
                    ...data,
                    frames: Number(newValue),
                  })
                }
              >
                <span>{data.frames}</span>
              </InputCell>
            </TableCell>
            <TableCell className="text-center items-center justify-center">
              <SelectCell
                enumObject={LulinInstrument}
                value={data.instrument}
                onUpdate={(newValue) =>
                  handleUpdateRow({
                    ...data,
                    instrument:
                      LulinInstrument[newValue as keyof typeof LulinInstrument],
                  })
                }
              >
                <span>{LulinInstrument[data.instrument]}</span>
              </SelectCell>
            </TableCell>
            <TableCell className="text-center items-center justify-center">
              <SelectCell
                value={data.filter}
                enumObject={LulinFilter}
                onUpdate={(newValue) =>
                  handleUpdateRow({
                    ...data,
                    filter: LulinFilter[newValue as keyof typeof LulinFilter],
                  })
                }
              >
                <span>{LulinFilter[data.filter]}</span>
              </SelectCell>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
