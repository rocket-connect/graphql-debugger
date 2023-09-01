import { useEffect, useState } from 'react';
import { Schema } from '../graphql-types';
import { listSchemas } from '../api/list-schemas';
import { useNavigate } from 'react-router-dom';

export function Schemas() {
  const navigate = useNavigate();
  const [schemas, setSchemas] = useState<Schema[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const _schemas = await listSchemas();

        setSchemas(_schemas);

        if (!_schemas.length) return;

        // We take the first schema
        navigate(`/schema/${_schemas[0].id}`);
      } catch (error) {
        console.error(error);
        setSchemas([]);
      }
    })();
  }, []);

  if (schemas.length) return <div className="hidden"></div>;

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="mx-auto border rounded-lg shadow-md p-8 w-96">
        <p className="text-center text-gray-600 text-lg">No Schemas found</p>
        <p className="text-center text-gray-400 mt-2">
          You can set up tracing by looking at the docs{' '}
          <a
            href="https://github.com/rocket-connect/graphql-debugger"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
