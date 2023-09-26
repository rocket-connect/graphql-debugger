import { Container } from "../utils/Container";
import {
  graphqlicon,
  miticon,
  otelicon,
  typescripticon,
} from "../utils/images";

const supported = [
  {
    name: "Compliant",
    content: "Compliant with your OpenTelemetry tools.",
    img: otelicon,
    link: "https://opentelemetry.io/",
  },
  {
    name: "Typescript",
    content: "Written in Typescript and published to NPM.",
    img: typescripticon,
    link: "https://www.typescriptlang.org/",
  },
  {
    name: "MIT",
    content: "Open Source and hosted on Github.",
    img: miticon,
    link: "https://github.com/rocket-connect/graphql-otel",
  },
  {
    name: "GraphQL",
    content: "Fits into your existing workflow.",
    img: graphqlicon,
    link: "https://graphql.org/",
  },
];

export function Supported() {
  return (
    <div className="bg-graphiql-light text-graphiql-medium">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between gap-10 py-5">
          {supported.map((item) => (
            <div className="flex flex-col justify-center align-center text-center gap-5">
              <h3 className="font-bold text-2xl">{item.name}</h3>
              <div className="w-16 mx-auto">
                <a href={item.link}>
                  <img src={item.img} alt={item.name} />
                </a>
              </div>
              <p className="w-3/5 mx-auto">{item.content}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
