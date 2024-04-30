# Contributing

Contributions of additional benchmarks are welcome, provided they meet the following conditions:

### One benchmark per GraphQL implementation

There are near infinite combinations of web servers, interpreters, serializers and other configurations. We want to keep it simple, which means **one** benchmark per GraphQL implementation.

The choices to be made should be based on a mix of **popularity** and **performance**. Picking fasthttp over net/http in Go is acceptable because it is a well known and faster alternative, despite being less popular. But picking an experimental web server with virtually no adoption is not ok, even if it beats all others in performance.

### No undocumented optimizations

We aim to compare benchmarks of GraphQL servers using default configurations because it reflects what most people see in production. Optimizations are permitted if they are prominently documented in their project's documentation.

### Utilize all available processor cores

Most server environments provide multiple processor cores, and implementations should be able to spread load among them.

## How to add benchmarks

Running benchmarks requires [Crystal](https://crystal-lang.org/) and [Nix](https://nixos.org/). A configuration for the VS Code [remote containers](https://code.visualstudio.com/docs/remote/containers) extension is included in this repo.

1. Create a folder with your benchmark files. Requests must be received as POST at `/graphql` on port 8000.
2. Add an entry to `benchmarks.yaml`
3. Open a shell using `nix-shell` to get all project dependencies
4. Run `./run.cr`

To add new programming languages, update `run.cr` and `shell.nix` first.
