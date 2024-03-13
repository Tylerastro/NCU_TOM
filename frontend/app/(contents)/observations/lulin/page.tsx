"use client";
import React from "react";
import { deleteObservation, getObservations } from "@/apis/observations";
import { Observation } from "@/models/observations";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TableWithPagination from "./table";
import Switch from "./switch";

export default function LulinStaffView() {
  const [observations, setObservations] = React.useState<Observation[]>([]);
  const [viewset, setViewset] = React.useState("Observations");

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
        <Switch viewset={viewset} setViewset={setViewset} />
      </Container>
      <TableWithPagination
        viewset={viewset}
        observations={observations}
        itemsPerPage={15}
      />
    </>
  );
}
