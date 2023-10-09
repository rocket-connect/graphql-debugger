import { useQuery } from "@tanstack/react-query";

import { listSchemas } from "../api/list-schemas";
import { ListSchema, NoSchema } from "../components";

export function Schemas() {
  const { data: schemas } = useQuery({
    queryKey: ["schemas"],
    queryFn: async () => await listSchemas(),
    networkMode: "always",
  });

  return (
    <div className="h-screen flex items-center bg-white-100 overflow-hidden">
      {schemas?.length === 0 ? <NoSchema /> : <ListSchema schemas={schemas} />}
    </div>
  );
}
