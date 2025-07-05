import LogoIcon from "~/components/common/logo-icon";
import type { Route } from "./+types/home";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "MetricSubs - Tech Without Boundaries" },
    { name: "description", content: "MetricSubs is a volunteer-powered localization studio committed to turning the world’s best tech videos into native-quality Mandarin content." },
  ];
}

export default function Home() {
  return <div className="flex flex-col items-center justify-center h-screen">
    <LogoIcon className="w-16 h-16 mb-4" />
    <h1 className="text-4xl font-semibold logo-font">MetricSubs</h1>
    <p className="mt-2 text">Tech Without Boundaries</p>
  </div>;
}
