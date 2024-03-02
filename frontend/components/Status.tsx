import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";

export default function StatusOptions(props: {
  width?: string;
  onStatusChange: (status: number) => void;
}) {
  const [option, setOptions] = React.useState("");
  const { width } = props;
  const { onStatusChange } = props;
  const widthValue = width || "100%"; // Assigns "100%" if width is falsy
  const handleChange = (event: SelectChangeEvent) => {
    setOptions(event.target.value as string);
    onStatusChange(Number(event.target.value));
  };

  return (
    <Box sx={{ width: widthValue, paddingTop: "1.5rem" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Status Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label="Status Filter"
          onChange={handleChange}
        >
          <MenuItem value={0}> Clear</MenuItem>
          <MenuItem value={1}>📝 In Preparation</MenuItem>
          <MenuItem value={2}>👀 Pending</MenuItem>
          <MenuItem value={3}>✅ In Progress</MenuItem>
          <MenuItem value={4}>👍 Complete</MenuItem>
          <MenuItem value={5}>‼️ Expired</MenuItem>
          <MenuItem value={6}>❌ Denied</MenuItem>
          <MenuItem value={7}>🔄 Postponed</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
