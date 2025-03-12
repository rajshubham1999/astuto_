
import React, { useMemo, useState, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, TextField, MenuItem, FormControlLabel, Radio, RadioGroup, Button } from "@mui/material";
import tableData from "../Data/data.json";
import "../App.css";

const DataTable = () => {
  const [filterName, setFilterName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 7;
  const debounceTimeout = useRef(null);

  const handleSearchChange = (value) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setFilterName(value);
    }, 300);
  };

  const filteredData = useMemo(() => {
    return tableData.filter(
      (person) =>
        person.name.toLowerCase().includes(filterName.toLowerCase()) &&
        (selectedRoles.length === 0 || selectedRoles.includes(person.role))
    );
  }, [filterName, selectedRoles]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if ((page + 1) < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <Box className="profile-cell">
            <img src={row.original.image} alt={row.original.name} className="profile-img" />
            <span>{row.original.name}</span>
          </Box>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => (
          <div className="status-container">
            <span className="status-text">{row.original.status}</span>
            <span className="status-subtext">Working</span>
          </div>
        ),
      },
      {
        accessorKey: "age",
        header: "Age",
        Cell: ({ row }) => (
          <span className="age">{row.original.age ? row.original.age : "N/A"}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        Cell: ({ row }) => (
          <span className={`role-badge ${row.original.role.toLowerCase().replace(/\s/g, "-")}`}>{row.original.role}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        Cell: ({ row }) => (
          <div className="email-container">
            <span>{row.original.email || "N/A"}</span>
          </div>
        ),
      },
      {
        accessorKey: "teams",
        header: "Teams",
        Cell: ({ row }) => {
          const teams = row.original.teams || [];
          return (
            <span className="teams">
              <span className="team1">{teams[0]}  </span>
              <span className="team2">{teams[1]}</span>
              <span className="team3">  {teams[2]}</span>
            </span>
          );
        },
      },
      {
        id: "radio-buttons",
        Cell: () => (
          <RadioGroup row>
            <FormControlLabel value="yes" control={<Radio />} />
            <FormControlLabel value="no" control={<Radio />} />
          </RadioGroup>
        ),
      },
    ],
    []
  );

  return (
    <Box className="table-container">
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search Name"
          variant="outlined"
          size="small"
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <TextField
          select
          label="Filter by Role"
          variant="outlined"
          size="small"
          SelectProps={{ multiple: true }}
          value={selectedRoles}
          onChange={(e) => setSelectedRoles(e.target.value)}
        >
          {[...new Set(tableData.map((person) => person.role))].map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box flex={1}>
        <MaterialReactTable
          columns={columns}
          data={paginatedData}
          enablePagination
          enableRowSelection
        />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" mt={2} className="pagination-container">
        <Button onClick={handlePrevPage} disabled={page === 0}>Previous</Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            onClick={() => handlePageClick(index)}
            variant={page === index ? "contained" : "outlined"}
          >
            {index + 1}
          </Button>
        ))}
        <Button onClick={handleNextPage} disabled={page + 1 >= totalPages}>Next</Button>
      </Box>
    </Box>
  );
};

export default DataTable;
