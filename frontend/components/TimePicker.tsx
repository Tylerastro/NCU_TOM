"use client";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Dayjs } from "dayjs";
import "dayjs/locale/zh-cn";
import { useState } from "react";

export default function BasicDateTimePicker({
  title,
  onchange,
}: {
  title: string;
  onchange: Function;
}) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const field = title === "Start Time" ? "start_date" : "end_date";

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    onchange(field, newValue?.format("YYYY-MM-DD HH:mm:ss")); // Invoke the passed onchange function
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <DemoContainer
        sx={{ width: "50%", paddingTop: "1rem" }}
        components={["DateTimePicker"]}
      >
        <DateTimePicker
          value={selectedDate}
          onChange={handleDateChange}
          label={title}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
