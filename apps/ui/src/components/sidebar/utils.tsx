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
import { IDS } from "../../testing";
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

export const iconsMapper = (): Record<
  string,
  {
    active: React.ReactNode;
    inactive: React.ReactNode;
    hidden?: boolean;
    type: string;
    id: string;
  }
> => ({
  schema: {
    id: IDS.sidebar.icons.schemas,
    type: "schema",
    active: <img className="w-8" src={folderFilled} />,
    inactive: <img className="w-8" src={folderStroke} />,
  },
  config: {
    id: IDS.sidebar.icons.config,
    type: "config",
    active: <img className="w-8" src={configFilled} />,
    inactive: <img className="w-8" src={configStroke} />,
  },
  login: {
    id: IDS.sidebar.icons.login,
    type: "login",
    active: <img className="w-8" src={loginFilled} />,
    inactive: <img className="w-8" src={loginStroke} />,
  },
  history: {
    id: IDS.sidebar.icons.history,
    type: "history",
    active: <HistoryFilled size={"35"} color="#3b4b68" />,
    inactive: <History size={"35"} color="#3b4b68" />,
  },
  favourites: {
    id: IDS.sidebar.icons.favourites,
    type: "favourites",
    active: <Star size={"35"} color="#3b4b68" />,
    inactive: <StarFilled size={"35"} color="#3b4b68" />,
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
    enabled: false,
  },
  {
    name: "Cookies",
    description: "We collect data to improve your experience",
    enabled: true,
    alwaysEnabled: true,
  },
];
