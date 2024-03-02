import { putLulin } from "@/apis/observations";
import TimePicker from "@/components/TimePicker";
import { LulinObservations } from "@/models/observations";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import * as React from "react";

type Option = {
  id: number;
  label: string;
};

const filterOptions: Option[] = [
  { id: 1, label: "u" },
  { id: 2, label: "g" },
  { id: 3, label: "r" },
  { id: 4, label: "i" },
  { id: 5, label: "z" },
];

const instrumentOptions: Option[] = [
  { id: 1, label: "LOT" },
  { id: 2, label: "SLT" },
  { id: 3, label: "TRIPOL" },
];

export default function LulinData(
  props: LulinObservations & {
    setCodeUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  }
) {
  const { setCodeUpdate, ...otherProps } = props;
  const [filter, setFilter] = React.useState<{ [key: string]: boolean }>(
    props.filters || {}
  );
  const [instrument, setInstrument] = React.useState<{
    [key: string]: boolean;
  }>(props.instruments || {});
  const [priority, setPriority] = React.useState<number | "">(props.priority);
  const [exposure, setExposure] = React.useState<number | "">(
    props.exposure_time || ""
  );
  const [startTime, setStartTime] = React.useState<string>(
    props.start_date || ""
  );
  const [endTime, setEndTime] = React.useState<string>(props.end_date || "");
  const [formData, setFormData] = React.useState<LulinObservations>(props);
  const [updateLulin, setUpdateLulin] = React.useState(false);

  const handleFilterChange = (event: SelectChangeEvent<string[]>) => {
    const selectedFilters = event.target.value as string[];
    const updatedFilters = filterOptions.reduce((acc, filter) => {
      acc[filter.label] = selectedFilters.includes(filter.label);
      return acc;
    }, {} as { [key: string]: boolean });

    setFilter(updatedFilters);
    setUpdateLulin(true);
    setCodeUpdate(true);
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value as number | "");
  };

  const handleDateChange = (field: string, newValue: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: newValue,
    }));
  };

  const handleExposureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExposure(event.target.value as number | "");
    setUpdateLulin(true);
    setCodeUpdate(true);
  };

  const handleInstrumentChange = (event: SelectChangeEvent<string[]>) => {
    const selectedInstruments = event.target.value as string[];
    const updatedInstruments = instrumentOptions.reduce((acc, filter) => {
      acc[filter.label] = selectedInstruments.includes(filter.label);
      return acc;
    }, {} as { [key: string]: boolean });

    setInstrument(updatedInstruments);
  };

  React.useEffect(() => {
    if (updateLulin) {
      const updateData = {
        filters: filter,
        priority: priority !== "" ? priority : undefined,
        exposure_time: exposure !== "" ? exposure : undefined,
      };

      // Execute the PUT request
      putLulin(props.id, updateData)
        .then((updatedData) => {
          console.log("Data updated successfully", updatedData);
          setUpdateLulin(false); // Reset codeBlock to false after update
        })
        .catch((error) => {
          // Handle errors
          console.error("Failed to update data", error);
        });
    }
  }, [filter, priority, exposure]);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{props.target.name}</Typography>{" "}
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            alignItems: "center",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link href="/targets">
            <Button
              size="large"
              sx={{
                color: "white",
                display: "block",
                textTransform: "capitalize",
                fontSize: "1.3rem",
              }}
            >
              {props.target.name}
            </Button>
          </Link>
          <FormControl
            variant="standard"
            sx={{ m: 1, minWidth: 100, maxWidth: 20, paddingTop: ".5rem" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Priority
            </InputLabel>
            <Select value={priority.toString()} onChange={handlePriorityChange}>
              {Array.from({ length: 10 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id="filter-select-label">Filters</InputLabel>
            <Select
              labelId="filter-select-label"
              id="filter-select"
              multiple
              value={Object.keys(filter).filter((key) => filter[key])}
              onChange={handleFilterChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {filterOptions.map((option) => (
                <MenuItem key={option.id} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id="instrument-select-label">Instruments</InputLabel>
            <Select
              labelId="instrument-select-label"
              id="instrument-select"
              multiple
              value={Object.keys(instrument).filter((key) => instrument[key])}
              onChange={handleInstrumentChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {instrumentOptions.map((option) => (
                <MenuItem key={option.id} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="exposure"
            label="exposure"
            type="number"
            value={exposure}
            onChange={handleExposureChange}
            variant="standard"
            sx={{ flexGrow: 0, maxWidth: "100px" }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TimePicker onchange={handleDateChange} title="Start Time" />
          <TimePicker onchange={handleDateChange} title="End Time" />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
