import { Schema } from "@graphql-debugger/types";

export type SideBarViewTypes = "schema" | "no-schema" | "schema-list" | "info";

export type SideBarSchemaView = {
  type: "schema";
  schema: Schema;
};

export type SideBarNoSchemaView = {
  type: "no-schema";
};

export type SideBarSchemaListView = {
  type: "schema-list";
  schemas: Schema[];
};

export type SideBarInfoView = {
  type: "info";
};

export type SideBarView = (
  | SideBarSchemaView
  | SideBarNoSchemaView
  | SideBarSchemaListView
  | SideBarInfoView
) & {
  isLoading?: boolean;
};

export interface SideBarProps {
  view?: SideBarView;
  close: () => void;
  open: (view: SideBarView) => void;
}
