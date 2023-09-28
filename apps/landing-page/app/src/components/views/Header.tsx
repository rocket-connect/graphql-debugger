import { Container } from "../utils/Container";
import { Logo } from "../utils/Logo";
import { githubWhite, npmWhite } from "../utils/images";

export function Header() {
  return (
    <div className="bg-graphiql-dark w-full py-2">
      <Container>
        <nav>
          <div className="flex flex-wrap items-center justify-between mx-auto py-2">
            <a href="#" className="flex items-center">
              <span className="w-10">
                <Logo />
              </span>
              <span className="ml-5 self-center font-bold whitespace-nowrap text-graphiql-light text-lg">
                GraphQL Debugger
              </span>
            </a>
            <div className="flex gap-10">
              <a
                href="https://www.npmjs.com/search?q=graphql-debugger"
                className="flex items-center"
              >
                <span className="w-8">
                  <img src={npmWhite} alt="npm" />
                </span>
              </a>
              <a
                href="https://github.com/rocket-connect/graphql-debugger"
                className="flex items-center"
              >
                <span className="w-8">
                  <img src={githubWhite} alt="github" />
                </span>
              </a>
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
}
