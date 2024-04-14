import { Docs, DocsFilled, Settings, SettingsFilled } from "../../icons";
import { History, HistoryActive as HistoryFilled } from "../../icons/history";
import { Star, StarFilled } from "../../icons/star";
import { IDS } from "../../testing";
import { SchemaViewer } from "../schema/viewer";
import { Config } from "./views/config";
import { Favourites } from "./views/favourites";
import { History as HistoryView } from "./views/history";
import { Info } from "./views/info/info";

interface SideBar {
  description: string;
  component: JSX.Element;
}

export const iconsMapper: Record<
  string,
  {
    active: React.ReactNode;
    inactive: React.ReactNode;
    hidden?: boolean;
    type: string;
    id: string;
  }
> = {
  schema: {
    id: IDS.sidebar.icons.schemas,
    type: "schema",
    active: <DocsFilled />,
    inactive: <Docs />,
  },
  config: {
    id: IDS.sidebar.icons.config,
    type: "config",
    active: <SettingsFilled height={35} width={35} />,
    inactive: <Settings height={35} width={35} />,
  },
  history: {
    id: IDS.sidebar.icons.history,
    type: "history",
    active: <HistoryFilled />,
    inactive: <History />,
  },
  favourites: {
    id: IDS.sidebar.icons.favourites,
    type: "favourites",
    active: <Star />,
    inactive: <StarFilled />,
  },
};

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
    enabled: true,
  },
  {
    name: "Cookies",
    description: "We collect data to improve your experience",
    enabled: true,
    alwaysEnabled: true,
  },
];
