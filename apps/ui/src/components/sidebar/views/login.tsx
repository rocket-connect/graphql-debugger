import { LinkedText } from "../../../components/utils/linked-text";
import { IDS } from "../../../testing";

export function Login() {
  return (
    <div id={IDS.sidebar.views.login} className="w-full text-netural-100">
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <label htmlFor="username" className="block font-bold">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="border rounded w-full p-2"
            placeholder="Username"
            disabled
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="password" className="block font-bold">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="border rounded w-full p-2"
            placeholder="******************"
            disabled
          />
        </div>
        <button
          type="button"
          className="rounded bg-graphql-otel-green text-white font-bold p-2 w-1/3 opacity-50"
          disabled
        >
          Sign In
        </button>

        <p className="text-xs">
          We are currently working on GraphQL Debugger Cloud, and are eager for
          your feedback and support.
        </p>

        <p className="italic text-xs">
          <LinkedText
            href="http://graphql-debugger.cloud/"
            text="graphql-debugger.cloud"
          />
        </p>
      </form>
    </div>
  );
}
