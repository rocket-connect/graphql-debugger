import { History, HistoryActive as HistoryFilled } from "../../icons/history";
import {
  configFilled,
  configStroke,
  folderFilled,
  folderStroke,
  loginFilled,
  loginStroke,
} from "../../images";
import { SchemaViewer } from "../schema/viewer";
import { Config } from "./views/config";
import { History as HistoryView } from "./views/history";
import { Info } from "./views/info/info";
import { Login } from "./views/login";

interface SideBar {
  description: string;
  component: JSX.Element;
}

export const iconsMapper = (
  disabledRoutes: string[] | undefined,
): Record<
  string,
  {
    active: React.ReactNode;
    inactive: React.ReactNode;
    hidden?: boolean;
    type: string;
  }
> => ({
  schema: {
    type: "schema",
    active: <img className="w-8" src={folderFilled} />,
    inactive: <img className="w-8" src={folderStroke} />,
  },
  config: {
    type: "config",
    active: <img className="w-8" src={configFilled} />,
    inactive: <img className="w-8" src={configStroke} />,
  },
  login: {
    type: "login",
    active: <img className="w-8" src={loginFilled} />,
    inactive: <img className="w-8" src={loginStroke} />,
  },
  history: {
    type: "history",
    active: <HistoryFilled />,
    inactive: <History />,
    hidden: !disabledRoutes?.includes("history"),
  },
});

export const sideBarComponentMapper = (
  currentSchema?: boolean,
): Record<string, SideBar> => ({
  schema: {
    description: currentSchema
      ? "Your GraphQL Schema, with analytics and traces"
      : "Select a GraphQL Schema to start exploring your traces",
    component: <SchemaViewer />,
  },
  info: {
    description: "",
    component: <Info />,
  },
  config: {
    description: "Configure GraphQL debugger settings, stored in your browser",
    component: <Config />,
  },
  login: {
    description:
      "Access GraphQL Debugger Cloud to view your projects and collaborate with your team",
    component: <Login />,
  },
  history: {
    description: "View your most recent traces",
    component: <HistoryView />,
  },
});
