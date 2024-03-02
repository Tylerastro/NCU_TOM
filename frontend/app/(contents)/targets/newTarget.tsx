import { createTarget } from "@/apis/targets";
import Tags from "@/components/Tags";
import { Tag } from "@/models/helpers";
import { Target } from "@/models/targets";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "react-toastify";

function isHourAngleFormat(input: string) {
  const hourAnglePattern = /^\d{1,2}:\d{1,2}(:\d{1,2}(\.\d+)?)?$/;
  return hourAnglePattern.test(input);
}
function convertHourAngleToDegrees(hourAngle: string) {
  if (!isHourAngleFormat(hourAngle)) {
    return parseFloat(hourAngle);
  }

  const parts = hourAngle.split(":");
  if (parts.length !== 3) {
    return 0;
  }

  const hours = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);

  const degrees = (hours + minutes / 60 + seconds / 3600) * 15;
  return degrees;
}

function convertSexagesimalDegreesToDecimal(sexagesimal: string) {
  if (!isHourAngleFormat(sexagesimal)) {
    return parseFloat(sexagesimal);
  }

  const parts = sexagesimal.split(":");
  if (parts.length !== 3) {
    return 0;
  }

  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);
  const decimalDegrees = degrees + minutes / 60 + seconds / 3600;
  return decimalDegrees;
}

export default function NewTargetForm({
  refreshData,
}: {
  refreshData: () => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const { data } = useRetrieveUserQuery();
  const handleClose = () => {
    setOpen(false);
  };

  const [name, setName] = React.useState("");
  const [ra_input, setRa_input] = React.useState("");
  const [dec_input, setDec_input] = React.useState("");
  const [ra, setRa] = React.useState(0);
  const [dec, setDec] = React.useState(0);
  const [raValid, setRaValid] = React.useState(true);
  const [decValid, setDecValid] = React.useState(true);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const router = useRouter();

  const handleCreate = async () => {
    if (!data) {
      router.push("/auth/signin");
      return;
    }

    try {
      const newTarget: Target = {
        name: name,
        ra: ra,
        dec: dec,
        tags: tags,
      };

      const res = await createTarget(newTarget);
      console.log(res.status);
      if (res.status === 201) {
        toast.success("Target created successfully");
      } else {
        toast.error("Failed to create target");
      }
      handleClose();
      await refreshData();
    } catch (error) {
      console.error("Error creating target:", error);
      toast.error("An error occurred while creating the target");
    }
  };

  React.useEffect(() => {
    const new_ra = convertHourAngleToDegrees(ra_input);
    const new_dec = convertSexagesimalDegreesToDecimal(dec_input);
    setRa(new_ra);
    setDec(new_dec);
    if (new_ra < 0 || new_ra > 360) {
      setRaValid(false);
    } else {
      setRaValid(true);
    }

    if (new_dec < -90 || new_dec > 90) {
      setDecValid(false);
    } else {
      setDecValid(true);
    }
  }, [ra_input, dec_input, ra, dec]);

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        New Target
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Target</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setName(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              autoFocus
              id="ra"
              label="RA"
              error={!raValid}
              helperText={!raValid ? "Invalid input: 0 < RA < 360" : ""}
              type="text"
              variant="standard"
              onChange={(e) => setRa_input(e.target.value)}
            />
            <TextField
              autoFocus
              id="dec"
              error={!decValid}
              helperText={!decValid ? "Invalid input: -90 < Dec < 90" : ""}
              label="Dec"
              type="text"
              variant="standard"
              onChange={(e) => setDec_input(e.target.value)}
            />
          </Box>
          <Tags placeholder="Tags" creatable={true} settags={setTags} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate}>Create</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
