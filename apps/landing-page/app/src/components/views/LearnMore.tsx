import { Container } from "../utils/Container";

export function LearnMore() {
  return (
    <Container>
      <div className="flex gap-20 py-20">
        <div className="bg-graphiql-medium rounded rounded-3xl p-3">
          <iframe
            className="rounded rounded-3xl"
            width="700"
            height="400"
            src={`https://www.youtube.com/embed/EpC6xmw2a6Y`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
        </div>

        <div className="flex flex-col gap-10 my-auto">
          <h2 className="text-5xl font-bold">Learn More</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam
            voluptatem atque dicta, et aspernatur tempora! Rerum sint pariatur
            eaque saepe commodi veritatis recusandae impedit id dignissimos
            placeat. Suscipit, a asperiores.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam
            voluptatem atque dicta, et aspernatur tempora! Rerum sint pariatur
            eaque saepe commodi veritatis recusandae impedit id dignissimos
            placeat. Suscipit, a asperiores.
          </p>
        </div>
      </div>
    </Container>
  );
}
