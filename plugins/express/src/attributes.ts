// https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/http/
export enum HttpServerAttributeNames {
  HTTP_ROUTE = "http.route",
  CLIENT_ADDRESS = "client.address",
  CLIENT_PORT = "client.port",
  CLIENT_SOCKET_ADDRESS = "client.socket.address",
  CLIENT_SOCKET_PORT = "client.socket.port",
  SERVER_ADDRESS = "server.address",
  SERVER_PORT = "server.port",
  SERVER_SOCKET_ADDRESS = "server.socket.address",
  SERVER_SOCKET_PORT = "server.socket.port",
  URL_PATH = "url.path",
  URL_QUERY = "url.query",
}
