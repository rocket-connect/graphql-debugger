import { useEffect, useState } from 'react';
import { Schema } from '../graphql-types';
import { listSchemas } from '../api/list-schemas';
import { parse, print } from 'graphql';
import { Link } from 'react-router-dom';

export function Schemas() {
  const [schemas, setSchemas] = useState<Schema[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const _schemas = await listSchemas();

        setSchemas(_schemas);
      } catch (error) {
        console.error(error);
        setSchemas([]);
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-4xl mb-10">Schemas</h2>

      {!schemas.length && <p>No schemas found.</p>}

      <div className="flex flex-row gap-10 text-white">
        {schemas.map((schema) => (
          <div className="border border-white">
            <div className="border border-white p-5">
              <h2 className="text-2xl">{schema.name || 'Untitled Schema'}</h2>
            </div>
            <p>
              <Link to={`/schema/${schema.id}`}>View traces</Link>
            </p>

            <div className="overflow-scroll w-80 h-80 m-20">
              <pre>{print(parse(schema.typeDefs))}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
