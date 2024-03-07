"use client";

import { getObservations } from "@/apis/observations";
import { Observation } from "@/models/observations";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/navigation";
import Info from "./info";
import * as React from "react";

export default function Page({ params }: { params: { id: number } }) {
  const [value, setValue] = React.useState(0);
  const [observation, setObservation] = React.useState<Observation>(
    {} as Observation
  );

  const router = useRouter();

  React.useEffect(() => {
    getObservations(params.id)
      .then((data) => {
        setObservation(data[0]);
      })
      .catch((error) => {
        router.push("/observations");
      });
  }, [params.id, router]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <Info observation={observation} />;
      case 1:
        const queryParams = new URLSearchParams({
          observatory: observation.observatory,
          start_date: observation.start_date,
          end_date: observation.end_date,
          id: observation.id.toString(),
        }).toString();
        router.push(`/observations/complete-your-submission?${queryParams}`);
      case 2:
        return <div>Loading...</div>;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:text-center">
        <p className="mt-2 text-5xl font-bold tracking-tight text-[#96fb4d] sm:text-5xl">
          {observation?.name}
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">Description</p>
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
            icon={<FindInPageIcon />}
            label="Data Products"
            aria-label="details"
            className="flex-1"
          />
        </Tabs>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}
