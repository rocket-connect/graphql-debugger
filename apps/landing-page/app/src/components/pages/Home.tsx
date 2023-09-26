import { Container } from "../utils/Container";
import { npxGraphQLDebugger } from "../utils/images";

export function Home() {
  return (
    <div className="bg-graphiql-medium text-graphiql-light py-20">
      <Container>
        <div className="flex align-center justify-center py-20 w-4/6 mx-auto">
          <div className="flex flex-col">
            <h1 className="text-left font-bold text-rocket-connect-darkblue text-6xl tracking-wide">
              Debug your GraphQL server locally.
            </h1>

            <a
              href="https://github.com/rocket-connect/graphql-debugger"
              className="mt-10"
            >
              <button
                type="button"
                className="bg-graphiql-light hover:bg-graphiql-highlight hover:text-graphiql-light text-graphiql-dark font-bold px-6 py-3 rounded"
              >
                Get Started
              </button>
            </a>
          </div>

          <div className="w-80 my-auto">
            <img
              className="rotate-12 hover:rotate-0 hover:cursor-pointer transition duration-500 ease-in-out transform"
              src={npxGraphQLDebugger}
              alt="npx graphql-debugger"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
