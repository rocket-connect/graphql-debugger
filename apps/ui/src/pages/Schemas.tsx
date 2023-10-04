import { useQuery } from "@tanstack/react-query";

import { listSchemas } from "../api/list-schemas";
import { ListSchema } from "../components/common/ListSchema";
import { NoSchema } from "../components/common/NoSchema";

export function Schemas() {
  const { data: schemas } = useQuery({
    queryKey: ["schemas"],
    queryFn: async () => await listSchemas(),
  });

  return (
    <div className="h-screen flex items-center bg-white-100 overflow-hidden">
      {schemas?.length === 0 ? <NoSchema /> : <ListSchema schemas={schemas} />}
    </div>
  );
}
