import { Container } from "../utils/Container";
import { screenshot } from "../utils/images";

export function About() {
  return (
    <Container>
      <div className="flex flex-col md:flex-row justify-start py-20 gap-20 w-full lg:w-5/6 lg:mx-auto">
        <div className="my-auto w-full">
          <img className="md:mx-auto md:my-0" src={screenshot} alt="logo" />
        </div>

        <div className="flex flex-col gap-10">
          <h2 className="text-4xl font-bold">About</h2>
          <p>
            GraphQL Debugger is a{" "}
            <a className="text-link" href="https://opentelemetry.io/">
              OpenTelemetry
            </a>{" "}
            collector with a user interface tailored for debugging GraphQL
            servers. It is designed to be used during development to help you
            identify errors, slow queries, and inconsistencies without having to
            rely on outdated methods like logging.
          </p>
          <p>
            GraphQL Debugger is free to use, open source, and you can find the
            source code on{" "}
            <a
              className="text-link"
              href="https://github.com/rocket-connect/graphql-debugger"
            >
              GitHub
            </a>
            . You can get started by simply installing our plugin and then
            running our CLI to initiate the user interface.
          </p>

          <p>
            GraphQL Debugger is developed and maintained by{" "}
            <a className="text-link" href="https://rocketconnect.co.uk/">
              Rocket Connect
            </a>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
