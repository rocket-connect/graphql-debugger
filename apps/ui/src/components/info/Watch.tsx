export function Watch() {
  return (
    <div className="flex flex-col gap-5">
      <div className="p-5">
        <iframe
          className="rounded-2xl w-full h-40 shadow"
          src={`https://www.youtube.com/embed/EpC6xmw2a6Y`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
    </div>
  );
}
