import ObservationApis from "@/apis/observations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LulinObservations } from "@/models/observations";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CodeBlock from "./codeblock";
import Feeds from "./feeds";
import LulinData from "./lulinData";
import MoonAltAz from "./moonAltAz";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col space-y-3 py-10">
      <Skeleton className="h-[250px] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-8/12" />
        <Skeleton className="h-4 w-6/12" />
      </div>
    </div>
  );
}

export default function Lulin(props: {
  start_date: string;
  end_date: string;
  observation_id: number;
}) {
  const { getLulin, getObservations } = ObservationApis();
  const [dataReady, setDataReady] = useState(false);
  const [codeUpdate, setCodeUpdate] = useState(false);

  const { data: lulinObservations } = useQuery({
    queryKey: ["getLulin"],
    queryFn: () =>
      getLulin(props.observation_id).then((data) => {
        setDataReady(true);
        return data;
      }),
    initialData: [] as LulinObservations[],
  });

  const { data: observations } = useQuery({
    queryKey: ["getObservation"],
    queryFn: () => getObservations(props.observation_id),
  });
  const observation = observations?.[0];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Observation</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div className="text-xl font-bold">
                <span className="text-base">{observation?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Targets</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lulinObservations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6Z"
              />
            </svg>
          </CardHeader>
          <CardContent>{observation?.user?.username}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Proposal Observation
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">False</div>
          </CardContent>
        </Card>
      </div>

      {dataReady ? (
        <div className="flex justify-center w-full py-5">
          <MoonAltAz
            start_date={props.start_date}
            end_date={props.end_date}
            observation_id={props.observation_id}
          />
        </div>
      ) : (
        LoadingSkeleton()
      )}

      <div className="flex justify-center">
        <LulinData data={lulinObservations} setCodeUpdate={setCodeUpdate} />
      </div>

      <div className="grid grid-cols-2 gap-12 sm:grid-cols-2 py-6">
        <CodeBlock
          observation_id={props.observation_id}
          codeUpdate={codeUpdate}
          setCodeUpdate={setCodeUpdate}
        />
        <Feeds observation_id={props.observation_id} />
      </div>
    </>
  );
}
