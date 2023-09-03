export function JsonValue({ value }: { value: any }): JSX.Element {
  if (Array.isArray(value)) {
    return (
      <span>
        {'['}
        <ul className={`pl-3`}>
          {value.map((item, index) => (
            <li key={index}>
              <JsonValue value={item} />
            </li>
          ))}
        </ul>
        {']'}
      </span>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <span>
        <span>{'{'}</span>
        <ul className={`pl-3`}>
          {Object.entries(value).map(([key, nestedValue], index) => (
            <li key={index}>
              <span className="text-graphql-otel-green">"{key}":</span>{' '}
              <JsonValue value={nestedValue} />
            </li>
          ))}
        </ul>
        <span>{'}'}</span>
      </span>
    );
  }

  if (typeof value === 'string') {
    return <span>"{value}"</span>;
  }

  if (typeof value === 'number') {
    return <span>{value}</span>;
  }

  if (typeof value === 'boolean') {
    return <span>{value ? 'true' : 'false'}</span>;
  }

  return <></>;
}
