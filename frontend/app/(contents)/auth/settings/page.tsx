import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DeleteAccount from "./deleteAccount";
import UpdateProfile from "./profile";

export default async function Component() {
  const session = await auth();
  console.log(session?.user);

  return (
    <div className="flex  flex-col min-h-90vh ">
      <header className="px-4 pt-7 shadow-sm sm:px-6">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg font-semibold">
              {session?.user.username}
            </div>
            <div className="text-sm text-muted-foreground">
              {session?.user.email}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-8">
          <Collapsible>
            <CollapsibleTrigger
              disabled
              className="flex w-full items-center justify-between gap-4 border-b bg-background p-4 font-medium  hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-90"
            >
              Change Password
              <ChevronRightIcon className="h-5 w-5 transition-all" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4  CollapsibleContent">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Update Password</Button>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="rounded-lg border">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 border-b bg-background p-4 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-90">
              Update Profile
              <ChevronRightIcon className="h-5 w-5 transition-all" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 CollapsibleContent">
              <UpdateProfile
                userId={session?.user.id || 0}
                username={session?.user.username || ""}
                first_name={session?.user.first_name || ""}
                last_name={session?.user.last_name || ""}
                institute={session?.user.institute || ""}
              />
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="rounded-lg border">
            <CollapsibleTrigger
              disabled
              className="flex w-full items-center justify-between gap-4 border-b bg-background p-4 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-90"
            >
              Notification Preferences
              <ChevronRightIcon className="h-5 w-5 transition-all" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 CollapsibleContent">
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="push-notifications" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sms-notifications" />
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className="rounded-lg border w-[350px] space-y-2">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 border-b bg-background p-4 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-90">
              Delete Account
              <ChevronRightIcon className="h-5 w-5 transition-all" />
            </CollapsibleTrigger>
            <CollapsibleContent className=" space-y-4  CollapsibleContent">
              <DeleteAccount />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>
    </div>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
