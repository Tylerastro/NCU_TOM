"use client";

import { fetchTargets } from "@/apis/targets";
import { Target } from "@/models/targets";
import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/navigation";
import PopDialog from "@/components/Dialog";
import * as React from "react";
import Info from "./info";
import Detail from "./detail";
import Observations from "./observations";

export default function Page({ params }: { params: { id: number } }) {
  const [value, setValue] = React.useState(0);
  const [target, setTarget] = React.useState<Target | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    fetchTargets(params.id)
      .then((data) => {
        setTarget(data);
      })
      .catch((error) => {
        console.log(error);
        router.push("/targets");
      });
  }, [params.id, router]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <Info target={target} />;
      case 1:
        return <Observations target={target} />;
      case 2:
        return <Detail target={target} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <PopDialog />
      <div className="mx-auto max-w-2xl lg:text-center">
        <p className="mt-2 text-5xl font-bold tracking-tight text-[#96fb4d] sm:text-5xl">
          {target?.name}
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">{target?.notes}</p>
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
