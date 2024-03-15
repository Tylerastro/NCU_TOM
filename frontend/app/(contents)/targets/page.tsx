"use client";
import { deleteBulkTarget, deleteTarget, fetchTargets } from "@/apis/targets";
import TagSelection from "@/components/Tags";
import { Tag } from "@/models/helpers";
import {
  useLogoutMutation,
  useRetrieveUserQuery,
} from "@/redux/features/authApiSlice";
import { Target } from "@/models/targets";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Box, Button, Container, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import Link from "next/link";
import React from "react";
import BulkCreation from "./bulkCreate";
import NewTarget from "./newTarget";

export default function DataTable() {
  const [allRows, setAllRows] = React.useState<Target[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<Target[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<GridRowId[]>([]);
  const [tagsRefreshSignal, setTagsRefreshSignal] = React.useState(false);

  const { data } = useRetrieveUserQuery();
  const handleTagChange = (newTags: Tag[]) => {
    setSelectedTags(newTags);
  };

  React.useEffect(() => {
    fetchTargets()
      .then((data) => {
        setAllRows(data);
        setFilteredRows(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const filterRows = React.useMemo(() => {
    let rows = allRows;

    if (selectedTags.length > 0) {
      rows = rows.filter((row) =>
        selectedTags.some((tag) =>
          row.tags.map((t) => t.name).includes(tag.name)
        )
      );
    }

    return rows;
  }, [allRows, selectedTags]);

  React.useEffect(() => {
    let newFilteredRows = allRows;

    if (selectedTags.length > 0) {
      newFilteredRows = newFilteredRows.filter((row) =>
        row.tags.some((tag) =>
          selectedTags.map((selectedTag) => selectedTag.name).includes(tag.name)
        )
      );
    }

    setFilteredRows(newFilteredRows);
  }, [allRows, selectedTags]);

  const applyFilters = (data: Target[]) => {
    let newFilteredRows = data;
    setFilteredRows(newFilteredRows);
  };

  const refreshData = async () => {
    try {
      const data = await fetchTargets();
      setAllRows(data);
      applyFilters(data);
      setTagsRefreshSignal((prev) => !prev);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: GridRowId) => {
    try {
      const num_id = parseInt(id.toString());
      await deleteTarget(num_id);
      await refreshData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleDeleteBulk = async (ids: GridRowId[]) => {
    try {
      const num_ids = ids.map((id) => parseInt(id.toString()));
      await deleteBulkTarget(num_ids);
      setSelectedRows([]);
      await refreshData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleRowSelectionChange = React.useCallback(
    (newSelectionModel: GridRowId[]) => {
      setSelectedRows(newSelectionModel);
    },
    []
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 75 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <Link href={`/targets/${params.row.id}`}>{params.value}</Link>
      ),
    },
    {
      field: "ra",
      headerName: "Ra",
      headerAlign: "center",
      width: 120,
      align: "center",
      renderCell: (params) => params.value.toFixed(3),
    },
    {
      field: "dec",
      headerName: "Dec",
      headerAlign: "center",
      type: "number",
      width: 120,
      align: "center",
    },
    {
      field: "created_at",
      headerName: "Created at",
      headerAlign: "center",
      width: 300,
      align: "center",
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
            onClick={() => handleDelete(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  if (data && [1, 2].includes(data.role)) {
    columns.splice(1, 0, {
      field: "user",
      headerName: "User",
      width: 150,
      renderCell: (params) => (
        <Link href={`/users/${params.row.user.id}`}>
          {params.value.username}
        </Link>
      ),
    });
  }

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 2,
        }}
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary-foreground">
          Targets
        </h1>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 5 }}>
          <Button
            variant="outlined"
            disabled={selectedRows.length === 0}
            color="secondary"
            onClick={() => handleDeleteBulk(selectedRows)}
          >
            Delete Selected
          </Button>
          <NewTarget refreshData={refreshData} />
          <BulkCreation refreshData={refreshData} />
        </Box>
      </Container>
      <Container maxWidth={false} sx={{ paddingBottom: 2 }}>
        <TagSelection
          width="100%"
          placeholder="Tag Filter"
          creatable={false}
          settags={handleTagChange}
          refreshSignal={tagsRefreshSignal}
        />
      </Container>
      <div
        className="dataTable"
        style={{
          height: 600,
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
          }}
          pageSizeOptions={[20, 30, 50]}
          checkboxSelection
          onRowSelectionModelChange={handleRowSelectionChange}
          rowSelectionModel={selectedRows}
        />
      </div>
    </>
  );
}
