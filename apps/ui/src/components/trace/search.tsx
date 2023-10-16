import { InfoLogo } from "../sidebar/views/info/info-logo";

export function Search() {
  return (
    <div className="flex flex-col gap-5">
      <p>
        We are working on bringing you search functionality, and are eager for
        your feedback and support.
      </p>
      <p className="text-xs">
        In the meantime you can navigate through the schema in the sidebar to
        filter the traces.
      </p>
      <div className="mt-10">
        <InfoLogo />
      </div>
    </div>
  );
}
