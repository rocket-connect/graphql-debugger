import { useEffect, useState } from 'react';
import { Schema } from '../graphql-types';
import { listSchemas } from '../api/list-schemas';
import { useNavigate } from 'react-router-dom';
import { logo } from '../utils/images';

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
    <div className="flex h-screen justify-center items-center text-graphiql-light">
      <div className="mx-auto border rounded-lg shadow-md p-8 w-96 flex flex-col gap-6">
        <div className="flex flex-row gap-2 py-1 align-center mx-auto justify-center">
          <img className="w-10 my-auto" src={logo}></img>
          <p className="my-auto text-large font-bold">GraphQL Debugger</p>
        </div>
        <p className="text-center text-lg">No Schemas found</p>
        <p className="text-center mt-2">
          <a
            href="https://github.com/rocket-connect/graphql-debugger"
            className="font-bold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </p>
      </div>
    </div>
  );
}
