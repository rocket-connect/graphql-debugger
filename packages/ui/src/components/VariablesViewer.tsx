interface JsonViewerProps {
  json: string;
}

function renderValue(value: any): JSX.Element {
  if (Array.isArray(value)) {
    return (
      <span>
        {'['}
        <ul className={`ml-3`}>
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
        {']'}
      </span>
    );
  } else if (typeof value === 'object' && value !== null) {
    return (
      <span>
        <span>{'{'}</span>
        <ul className={`ml-3`}>
          {Object.entries(value).map(([key, nestedValue], index) => (
            <li key={index}>
              <span className="text-graphql-otel-green">"{key}":</span> {renderValue(nestedValue)}
            </li>
          ))}
        </ul>
        <span>{'}'}</span>
      </span>
    );
  } else if (typeof value === 'string') {
    return <span>"{value}"</span>;
  } else if (typeof value === 'number') {
    return <span>{value}</span>;
  } else if (typeof value === 'boolean') {
    return <span>{value ? 'true' : 'false'}</span>;
  }
  return <></>;
}

export function VariablesViewer({ json }: JsonViewerProps) {
  const data = JSON.parse(json);

  return (
    <div className="flex-1 overflow-y-auto text-graphiql-light">
      <pre className="text-xs flex flex-col gap-5">{renderValue(data)}</pre>
    </div>
  );
}
