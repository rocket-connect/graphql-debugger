import { LinkedText } from "../utils/LinkedText";

export function Help() {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-bold">Help</h3>
      <p className="text-xs">
        If you require further assistance
        <span className="italic">
          , or you found something that is not quite right,
        </span>{" "}
        please open an issue on{" "}
        <LinkedText
          href="https://github.com/rocket-connect/graphql-debugger"
          text="our GitHub"
        />{" "}
        repository. We accept all feedback and happy to help.
      </p>
    </div>
  );
}
