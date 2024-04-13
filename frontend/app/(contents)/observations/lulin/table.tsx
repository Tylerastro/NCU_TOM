import React, { useState } from "react";
import { getStatusLabel } from "@/models/enums";
import Link from "next/link";
import { Observation } from "@/models/observations";

interface TableWithPaginationProps {
  viewset: string;
  observations: Observation[];
  itemsPerPage: number;
}

interface ObservationTableProps {
  observations: Observation[];
  itemsPerPage: number;
}

interface LulinTableProps {
  observations: Observation[];
  itemsPerPage: number;
}

const ObservationTable: React.FC<ObservationTableProps> = ({
  observations,
  itemsPerPage,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(observations.length / itemsPerPage);

  const handlePreviousClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = observations.slice(startIndex, endIndex);

  const paginationNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-2 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              User
            </th>
            <th scope="col" className="px-6 py-3">
              Start Date
            </th>
            <th scope="col" className="px-6 py-3">
              End Date
            </th>
            <th scope="col" className="px-6 py-3">
              #Targets
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((observation) => (
            <tr
              key={observation.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {observation.id}
              </th>
              <td className="px-6 py-4">
                {" "}
                <Link href={`/observations/${observation.id}`}>
                  {observation.name}
                </Link>
              </td>
              <td className="px-6 py-4">{observation.user?.username}</td>
              <td className="px-6 py-4">{observation.start_date}</td>
              <td className="px-6 py-4">{observation.end_date}</td>
              <td className="px-6 py-4">{observation.targets?.length ?? 0}</td>
              <td className="px-6 py-4">
                <div className="font-medium text-blue-600 dark:text-blue-500">
                  {getStatusLabel(observation.status)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav className="flex items-center justify-between pt-4">
        <span className="text-sm font-normal text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, observations.length)} of{" "}
          {observations.length}
        </span>
        <ul className="inline-flex -space-x-px text-sm h-8">
          <li>
            <button
              onClick={handlePreviousClick}
              className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Previous
            </button>
          </li>
          {paginationNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => handlePageClick(number)}
                className={`px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${
                  currentPage === number
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleNextClick}
              className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const LulinTable: React.FC<ObservationTableProps> = ({
  observations,
  itemsPerPage,
}) => {
  const targets = observations.map((observation) => observation.targets).flat();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(targets.length / itemsPerPage);

  const handlePreviousClick = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = targets.slice(startIndex, endIndex);

  const paginationNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-2 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              ra
            </th>
            <th scope="col" className="px-6 py-3">
              dec
            </th>
            <th scope="col" className="px-6 py-3">
              z
            </th>
            <th scope="col" className="px-6 py-3">
              coordinates
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((target) => (
            <tr
              key={target?.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {target?.id}
              </th>
              <td className="px-6 py-4">
                {" "}
                <Link href={`/target/${target?.id}`}>{target?.name}</Link>
              </td>
              <td className="px-6 py-4">{target?.ra}</td>
              <td className="px-6 py-4">{target?.dec}</td>
              <td className="px-6 py-4">{target?.redshift}</td>
              <td className="px-6 py-4">{target?.coordinates}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav className="flex items-center justify-between pt-4">
        <span className="text-sm font-normal text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, targets.length)} of{" "}
          {targets.length}
        </span>
        <ul className="inline-flex -space-x-px text-sm h-8">
          <li>
            <button
              onClick={handlePreviousClick}
              className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Previous
            </button>
          </li>
          {paginationNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => handlePageClick(number)}
                className={`px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${
                  currentPage === number
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleNextClick}
              className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const TableWithPagination: React.FC<TableWithPaginationProps> = ({
  viewset,
  observations,
  itemsPerPage,
}) => {
  if (viewset === "Observations") {
    return (
      <ObservationTable
        observations={observations}
        itemsPerPage={itemsPerPage}
      />
    );
  } else if (viewset === "Lulin") {
    return (
      <LulinTable observations={observations} itemsPerPage={itemsPerPage} />
    );
  }
};

export default TableWithPagination;
