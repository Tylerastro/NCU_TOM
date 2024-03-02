import { fetchTargets } from "@/apis/targets";
import { Target } from "@/models/targets";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";

export default function TargetOptions({ onTargetChange }: any) {
  const [targets, setTargets] = React.useState<Target[]>([]);

  React.useState(() => {
    fetchTargets()
      .then((data) => {
        setTargets(data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });

  return (
    <Autocomplete
      sx={{ paddingTop: ".5rem" }}
      multiple
      id="targets"
      options={targets}
      onChange={onTargetChange} // Use the passed function here
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField {...params} variant="standard" label="Targets" />
      )}
    />
  );
}
