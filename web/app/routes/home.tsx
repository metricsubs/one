import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router";
import LogoIcon from "~/components/common/logo-icon";
import { Button } from "~/components/ui";
import type { Route } from "./+types/home";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "MetricSubs - Tech Without Boundaries" },
    { name: "description", content: "MetricSubs is a volunteer-powered localization studio committed to turning the world’s best tech videos into native-quality Mandarin content." },
  ];
}

export default function Home() {

  const { user } = useUser();

  return <div className="flex flex-col items-center justify-center h-screen">
    <LogoIcon className="w-16 h-16 mb-4" />
    <h1 className="text-4xl font-semibold logo-font">MetricSubs</h1>
    <p className="mt-2 text">Tech Without Boundaries</p>
    {user && <div className="flex flex-col items-center gap-2 mt-2">
      <p className="text-sm text-muted-fg">Signed in as {user.emailAddresses[0].emailAddress}</p>
      <div className="flex gap-2">
        <Link to="/dashboard">
          <Button intent="outline" size="md">
            Dashboard
          </Button>
        </Link>
        <SignOutButton>
          <Button intent="outline" size="md">
            Logout
          </Button>
        </SignOutButton>
      </div>
    </div>}
  </div>;
}
