"use client";

import { fetchTargets } from "@/apis/targets";
import PopDialog from "@/components/Dialog";
import { Target } from "@/models/targets";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import Detail from "./detail";
import Info from "./info";
import Observations from "./observations";

export default function Page({ params }: { params: { id: number } }) {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const { data: targetData } = useQuery({
    queryKey: ["getTarget"],
    queryFn: () => fetchTargets(params.id),
    initialData: [] as Target[],
  });

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <Info target={targetData[0]} />;
      case 1:
        return <Observations target={targetData[0]} />;
      case 2:
        return <Detail target={targetData[0]} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <PopDialog />
      <div className="mx-auto max-w-2xl lg:text-center">
        <p className="mt-2 text-5xl font-bold tracking-tight text-[#96fb4d] sm:text-5xl">
          {targetData[0]?.name}
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {targetData[0]?.notes}
        </p>
      </div>
      <div className="mx-auto max-w-2xl lg:max-w-none flex items-center justify-center">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon tabs example"
          className="flex w-full"
        >
          <Tab
            icon={<InfoOutlinedIcon />}
            label="Info"
            aria-label="info"
            className="flex-1"
          />
          <Tab
            icon={<AdsClickOutlinedIcon />}
            label="Observations"
            aria-label="observations"
            className="flex-1"
          />
          <Tab
            icon={<PersonPinIcon />}
            label="Details"
            aria-label="details"
            className="flex-1"
          />
        </Tabs>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}
