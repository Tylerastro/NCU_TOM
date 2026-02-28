"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const TargetIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
    <circle cx="12" cy="12" r="7" strokeWidth={2} />
  </svg>
);

const TelescopeIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const ChartIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  variant: "default" | "outline" | "secondary";
}

const quickActions: QuickAction[] = [
  {
    label: "New Target",
    href: "/targets",
    icon: <TargetIcon />,
    description: "Add astronomical target",
    variant: "default",
  },
  {
    label: "New Observation",
    href: "/observations",
    icon: <TelescopeIcon />,
    description: "Create observation request",
    variant: "outline",
  },
  {
    label: "View Data Products",
    href: "/data-products",
    icon: <ChartIcon />,
    description: "Browse observation data",
    variant: "outline",
  },
];

export default function QuickActionsCard() {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
        <CardDescription className="text-xs">
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            asChild
            variant={action.variant}
            className="w-full justify-start gap-3"
          >
            <Link href={action.href}>
              <span className="flex items-center justify-center h-6 w-6 rounded bg-neutral-100 dark:bg-neutral-800">
                {action.icon}
              </span>
              <span className="flex flex-col items-start">
                <span className="text-sm font-medium">{action.label}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                  {action.description}
                </span>
              </span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
