import { Home } from "./components/pages/Home";
import { About } from "./components/views/About";
import { Footer } from "./components/views/Footer";
import { GettingStarted } from "./components/views/GettingStarted";
import { Header } from "./components/views/Header";
import { LearnMore } from "./components/views/LearnMore";
import { Supported } from "./components/views/Supported";

export function App() {
  return (
    <div className="bg-graphiql-dark text-graphiql-light h-full">
      <Header />
      <Home />
      <About />
      <Supported />
      <GettingStarted />
      <LearnMore />
      <Footer />
    </div>
  );
}
