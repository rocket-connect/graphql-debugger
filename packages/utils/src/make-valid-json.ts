export function makeValidJSON(input: string) {
  return input.replace(/"(.*?[^\\])"/gs, function (match, p1) {
    return '"' + p1.replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
  });
}
