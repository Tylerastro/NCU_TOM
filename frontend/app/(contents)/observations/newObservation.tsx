import { createObservation } from "@/apis/observations";
import SelectPriorities from "@/components/Priorities";
import Tags from "@/components/Tags";
import TargetOptions from "@/components/Targets";
import TimePicker from "@/components/TimePicker";
import { Tag } from "@/models/helpers";
import { Target } from "@/models/targets";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import * as React from "react";
import SelectObservatory from "./observatory";

interface FormData {
  name: string;
  observatory: string;
  priority: number;
  targets: number[]; // Assuming targets are an array of target IDs
  start_date: string;
  end_date: string;
  tags: Tag[];
}
export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    observatory: "",
    priority: 1,
    targets: [],
    start_date: "",
    end_date: "",
    tags: [],
  });

  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    setOpen(false);

    try {
      const response = await createObservation(formData);
      const queryParams = new URLSearchParams({
        observatory: formData.observatory,
        start_date: formData.start_date,
        end_date: formData.end_date,
        id: response.id,
      }).toString();

      router.push(`/observations/complete-your-submission?${queryParams}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleTagChange = (newTags: Tag[]) => {
    setFormData({ ...formData, tags: newTags });
  };

  const handleTargetChange = (event: React.SyntheticEvent, value: Target[]) => {
    const targetIds: number[] = value
      .map((target) => target.id) // Map to get IDs
      .filter((id): id is number => id !== undefined); // Filter out undefined values

    setFormData({ ...formData, targets: targetIds });
  };

  const handleDateChange = (field: string, newValue: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: newValue,
    }));
    console.log(formData);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value.toString() });
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        New Observation
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Target</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To apply for new observations, please fill out the following fields.
            If it is Target of Opportunity, please do select the tag.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={handleInputChange}
          />
          <Tags placeholder="Tags" creatable={true} settags={handleTagChange} />
          <Box sx={{ display: "flex", justifyContent: "space-around", gap: 3 }}>
            <SelectObservatory handleSelectChange={handleSelectChange} />
            <SelectPriorities handleSelectChange={handleSelectChange} />
          </Box>
          <TargetOptions onTargetChange={handleTargetChange} />
          <Box sx={{ display: "flex", justifyContent: "space-around", gap: 3 }}>
            <TimePicker onchange={handleDateChange} title="Start Time" />
            <TimePicker onchange={handleDateChange} title="End Time" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate}>Create</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
