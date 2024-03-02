import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";

export default function SelectObservatory({
  handleSelectChange,
}: {
  handleSelectChange: Function;
}) {
  const [observatory, setObservatory] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setObservatory(event.target.value);
    handleSelectChange(event);
  };

  return (
    <div>
      <FormControl
        required
        variant="standard"
        sx={{ m: 1, minWidth: 200, paddingTop: ".5rem" }}
      >
        <InputLabel id="demo-simple-select-standard-label">
          Observatory
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          name="observatory"
          value={observatory}
          onChange={handleChange}
          label="Observatory"
        >
          <MenuItem value=""></MenuItem>
          <MenuItem value={1}>Lulin</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
