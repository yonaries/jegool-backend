export default async function profileImagePlaceholder(): Promise<string> {
 const id = Math.floor(Math.random() * 500);
 try {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return data.sprites.front_default as string;
 } catch (error) {
  throw error;
 }
}
