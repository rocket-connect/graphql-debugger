import { Container } from "../utils/Container";
import { npxGraphQLDebugger } from "../utils/images";

export function Home() {
  return (
    <div className="bg-graphiql-medium text-graphiql-light py-10">
      <Container>
        <div className="flex flex-col md:flex-row gap-20 align-center justify-center py-20 w-full md:w-5/6 xl:w-4/6 mx-auto">
          <div className="flex flex-col gap-20">
            <h1 className="text-left font-bold text-rocket-connect-darkblue text-center md:text-left mx-auto md:m-0 text-4xl xl:text-5xl tracking-wide">
              Debug your GraphQL server locally.
            </h1>

            <a
              href="https://github.com/rocket-connect/graphql-debugger"
              className="mx-auto md:m-0"
            >
              <button
                type="button"
                className="bg-graphiql-light hover:bg-graphiql-highlight hover:text-graphiql-light text-graphiql-dark font-bold px-6 py-3 rounded"
              >
                Get Started
              </button>
            </a>
          </div>
          <div className="w-40 md:w-60 xl:w-80 my-auto mx-auto rotate-6	">
            <img src={npxGraphQLDebugger} alt="npx graphql-debugger" />
          </div>
        </div>
      </Container>
    </div>
  );
}
