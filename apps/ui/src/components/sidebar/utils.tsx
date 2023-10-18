import { History, HistoryActive as HistoryFilled } from "../../icons/history";
import {
  configFilled,
  configStroke,
  folderFilled,
  folderStroke,
  loginFilled,
  loginStroke,
} from "../../images";

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
