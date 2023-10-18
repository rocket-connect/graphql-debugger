import { History, HistoryActive as HistoryFilled } from "../../icons/history";
import { Star, StarFilled } from "../../icons/star";
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
import { Favourites } from "./views/favourites";
import { History as HistoryView } from "./views/history";
import { Info } from "./views/info/info";
import { Login } from "./views/login";

interface SideBar {
  description: string;
  component: JSX.Element;
}

export const iconsMapper = (
  routes: string[] | undefined,
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
    hidden: !routes?.includes("history"),
  },
  favourites: {
    type: "favourites",
    active: <Star size={30} />,
    inactive: <StarFilled size={30} />,
    hidden: !routes?.includes("favourites"),
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
  favourites: {
    description: "View your favourite traces",
    component: <Favourites />,
  },
});

export const configs = [
  {
    name: "Dark Mode",
    description: "Toggle between light and dark mode",
    callout: "(Comming Soon)",
    defaultDisabled: true,
    enabled: false,
  },
  {
    name: "History",
    description: "Enable the store of trace history in local storage",
    enabled: true,
  },
  {
    name: "Cookies",
    description: "We collect data to improve your experience",
    enabled: true,
  },
  {
    name: "Favourites",
    description: "We collect data to improve your experience",
    enabled: true,
  },
];
