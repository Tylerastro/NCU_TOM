export default async function Home() {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/Dalle-observatory.png")',
        backgroundAttachment: "scroll",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      {/* Content can be added here */}
      <div className="flex items-center justify-center min-h-screen">
        {/* Optional overlay for better text readability */}
      </div>
    </main>
  );
}
