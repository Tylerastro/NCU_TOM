"use client";
import { deleteObservation, getObservations } from "@/apis/observations";
import StatusOptions from "@/components/Status";
import TagSelection from "@/components/Tags";
import {
  getObservatoryLabel,
  getPriorityLabel,
  getStatusLabel,
} from "@/models/enums";
import { Tag } from "@/models/helpers";
import { Observation } from "@/models/observations";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import * as React from "react";
import FormDialog from "./newObservation";

export default function DataTable() {
  const [allRows, setAllRows] = React.useState<Observation[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<Observation[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<number>(0); // Assuming status is a string

  React.useEffect(() => {
    getObservations()
      .then((data) => {
        setAllRows(data);
        setFilteredRows(data); // Initially, all rows are displayed
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleStatusChange = (newStatus: number) => {
    setSelectedStatus(newStatus);
  };

  const handleTagChange = (newTags: Tag[]) => {
    setSelectedTags(newTags);
  };

  const filterRows = React.useMemo(() => {
    let rows = allRows;

    if (selectedTags.length > 0) {
      rows = rows.filter((row) =>
        selectedTags.some((tag) =>
          row.tags.map((t) => t.name).includes(tag.name)
        )
      );
    }

    if (selectedStatus) {
      console.log(selectedStatus);
      rows = rows.filter((row) => row.status === selectedStatus);
    }

    return rows;
  }, [allRows, selectedTags, selectedStatus]);

  React.useEffect(() => {
    let newFilteredRows = allRows;

    if (selectedTags.length > 0) {
      newFilteredRows = newFilteredRows.filter((row) =>
        row.tags.some((tag) =>
          selectedTags.map((selectedTag) => selectedTag.name).includes(tag.name)
        )
      );
    }

    if (selectedStatus) {
      newFilteredRows = newFilteredRows.filter(
        (row) => row.status === selectedStatus
      );
    }

    setFilteredRows(newFilteredRows);
  }, [allRows, selectedTags, selectedStatus]);

  const applyFilters = (data: Observation[]) => {
    let newFilteredRows = data;
    // Filter logic here (same as in your useEffect)
    setFilteredRows(newFilteredRows);
  };
  const refreshData = async () => {
    try {
      const data = await getObservations();
      setAllRows(data);
      // Apply the same filters to the new data
      applyFilters(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteObservation(id);
      refreshData();
    } catch (error) {
      console.error("Error deleting observation:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 75 },
    {
      field: "name",
      headerName: "Name",
      width: 125,
      renderCell: (params) => (
        <Link href={`/observations/${params.row.id}`}>{params.value}</Link>
      ),
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 180,
      renderCell: (params) => {
        const tagNames = params.value.map((tag: Tag) => tag.name).join(", ");
        return <span>{tagNames}</span>;
      },
    },
    {
      field: "observatory",
      headerName: "Observatory",
      width: 180,
      renderCell: (params) => getObservatoryLabel(params.value),
    },
    { field: "start_date", headerName: "Start Date", width: 250 },
    { field: "end_date", headerName: "End Date", width: 250 },
    {
      field: "priority",
      headerName: "Priority",
      width: 130,
      renderCell: (params) => getPriorityLabel(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => getStatusLabel(params.value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Delete",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(parseInt(id.toString()))}
            color="inherit"
          />,
        ];
      },
    },
  ];

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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
          Observations
        </h1>
        <FormDialog />
      </Container>
      <Container
        maxWidth={false}
        sx={{
          paddingBottom: 4,
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <TagSelection
          placeholder="Tag Filter"
          creatable={false}
          width="45%"
          settags={handleTagChange}
        />
        <StatusOptions onStatusChange={handleStatusChange} width="45%" />
      </Container>
      <div style={{ height: 600 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 15 },
            },
          }}
          pageSizeOptions={[5, 15]}
          // checkboxSelection
        />
      </div>
    </>
  );
}
