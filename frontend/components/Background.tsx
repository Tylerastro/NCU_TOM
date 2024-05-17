export default function Background() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background:
          "radial-gradient(circle, rgba(16,17,24,1) 0%, rgba(19,9,47,0.43601190476190477) 45%, rgba(15,5,40,0.3211659663865546) 55%, rgba(14,11,14,1) 100%)",
      }}
    />
  );
}
