import { Container } from "../utils/Container";

export function LearnMore() {
  return (
    <div className="bg-graphiql-light text-graphiql-dark">
      <Container>
        <div className="flex flex-col xl:flex-row gap-20 py-20 w-full lg:w-5/6 lg:mx-auto">
          <div className="bg-graphiql-medium w-full md:w-5/6 h-64 rounded rounded-3xl p-3 mt-auto mx-auto">
            <iframe
              className="rounded rounded-3xl w-full h-full"
              src={`https://www.youtube.com/embed/EpC6xmw2a6Y`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>

          <div className="flex flex-col gap-10 my-auto">
            <h2 className="text-4xl font-bold">Learn More</h2>
            <p>
              To learn more, watch{" "}
              <a href="https://x.com/dan_starns" className="text-link">
                Dan Starns
              </a>{" "}
              at{" "}
              <a
                href="https://guild.host/events/september-meetup-lxmkv4"
                className="text-link"
              >
                GraphQL London
              </a>{" "}
              where he teaches about, Observability, and OpenTelemetry,
              demonstrating how to trace and debug a Node.js GraphQL API. You
              can find the link{" "}
              <a href="https://youtu.be/EpC6xmw2a6Y" className="text-link">
                here.
              </a>
            </p>
            <p>
              GraphQL Debugger is free and Open Source, we encourage you to open
              issues on our{" "}
              <a href="https://rocketconnect.co.uk" className="text-link">
                GitHub
              </a>{" "}
              if you need assistance plus you can contact us at{" "}
              <a href="https://rocketconnect.co.uk" className="text-link">
                Rocket Connect
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
