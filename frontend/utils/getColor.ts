const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  const s = Math.abs(h % 50) + 50;
  const l = Math.abs(h % 50) + 50;
  console.log(h, s, l);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export default stringToColor;
