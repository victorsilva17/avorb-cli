import { ReactNode } from "react";
import { IoHome } from "react-icons/io5";
import { TbTemplate } from "react-icons/tb";

interface AppRoutes {
  icon: ReactNode;
  label: string;
  url: string;
}

const routes: AppRoutes[] = [
  {
    icon: <IoHome size={24} />,
    label: "Home",
    url: "/v1/home",
  },
  {
    icon: <TbTemplate size={24} />,
    label: "CRUD Sample",
    url: "/v1/sample",
  },
];

export default routes;
