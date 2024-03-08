"use client";
import React from "react";
import { deleteObservation, getObservations } from "@/apis/observations";
import StatusOptions from "@/components/Status";
import TagSelection from "@/components/Tags";
import { Tag } from "@/models/helpers";
import { Observation } from "@/models/observations";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import TableWithPagination from "./table";
import { getStatusLabel, StatusNumber } from "@/models/enums";

export default function LulinStaffView() {
  const [observations, setObservations] = React.useState<Observation[]>([]);

  React.useEffect(() => {
    getObservations()
      .then((data) => {
        setObservations(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 2,
        }}
      >
        <Typography variant="h4">Observations</Typography>
      </Container>
      <TableWithPagination observations={observations} itemsPerPage={15} />
    </>
  );
}
