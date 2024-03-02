import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";

export default function SelectPriorities({
  handleSelectChange,
}: {
  handleSelectChange: Function;
}) {
  const [priority, setPriority] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value);
    handleSelectChange(event);
  };

  return (
    <div>
      <FormControl
        required
        variant="standard"
        sx={{ m: 1, minWidth: 200, paddingTop: ".5rem" }}
      >
        <InputLabel id="demo-simple-select-standard-label">Priority</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={priority}
          name="priority"
          onChange={handleChange}
          label="Priority"
        >
          <MenuItem value=""></MenuItem>
          <MenuItem value={1}>High</MenuItem>
          <MenuItem value={2}>Medium</MenuItem>
          <MenuItem value={3}>Low</MenuItem>
          <MenuItem value={4}>Too</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
