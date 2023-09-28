import { Container } from "../utils/Container";
import { npxGraphQLDebugger } from "../utils/images";

export function Home() {
  return (
    <div className="bg-graphiql-medium text-graphiql-light py-10">
      <Container>
        <div className="flex flex-col md:flex-row gap-20 align-center justify-center py-20 w-5/6 mx-auto">
          <div className="flex flex-col gap-20">
            <h1 className="flex flex-col text-left font-bold text-center md:text-left mx-auto md:m-0 text-4xl xl:text-6xl">
              <span>Debug your GraphQL</span>
              <span>server locally.</span>
            </h1>

            <a
              href="https://github.com/rocket-connect/graphql-debugger"
              className="mx-auto md:m-0"
            >
              <button
                type="button"
                className="bg-graphiql-light hover:bg-graphql-otel-green text-graphiql-dark font-bold px-6 py-3 rounded"
              >
                Get Started
              </button>
            </a>
          </div>
          <div className="w-56 my-auto mx-auto rotate-6	animate-pulse hover:skew-x-6 hover:cursor-pointer">
            <a href="https://www.npmjs.com/package/graphql-debugger">
              <img src={npxGraphQLDebugger} alt="npx graphql-debugger" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
