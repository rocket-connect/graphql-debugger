import { Container } from "../utils/Container";

export function Home() {
  return (
    <div className="pt-12 overflow-hidden bg-graphiql-medium text-graphiql-light">
      <Container>
        <div className="py-24 flex flex-col align-center justify-center w-5/5 md:w-4/5 lg:w-3/5 mx-auto">
          <h1 className="text-center font-bold text-rocket-connect-darkblue text-4xl md:text-5xl xl:text-6xl">
            Debug your GraphQL server locally.
          </h1>

          <a
            href="https://github.com/rocket-connect/graphql-debugger"
            className="mx-auto mt-20"
          >
            <button
              type="button"
              className="bg-graphiql-light hover:bg-graphiql-highlight hover:text-graphiql-light text-graphiql-dark font-bold px-8 lg:px-12 py-2 lg:py-3"
            >
              Get Started
            </button>
          </a>
        </div>
      </Container>
    </div>
  );
}
