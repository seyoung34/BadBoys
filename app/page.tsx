// app/page.tsx
import { fetchRackets } from "@/app/lib/rackets";
import HomePage from "./HomePage";


export const revalidate = 60; // 60초마다 ISR


export default async function Page() {
  const rackets = await fetchRackets();


  return (
    <div>
      <HomePage rackets={rackets} />
    </div>
  );
}
