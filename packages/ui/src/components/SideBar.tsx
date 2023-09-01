import { docsFilled } from '../utils/images';

export function SideBar() {
  return (
    <div className="h-screen border-r border-graphiql-border w-20 flex flex-col p-3">
      <img className="h-12 w-12 mx-auto" src={docsFilled} />
    </div>
  );
}
