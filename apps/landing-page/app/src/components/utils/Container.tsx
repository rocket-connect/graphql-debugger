export function Container(props: React.PropsWithChildren) {
  return (
    <div className="container mx-auto w-5/6 md:w-4/6">{props.children}</div>
  );
}
