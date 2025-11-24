"use client";
import { useEffect, useState } from "react";

interface Racket {
  id: number;
  name: string;
  brand: string;
  price: number;
}

export default function Home() {
  const [rackets, setRackets] = useState<Racket[]>([]);

  useEffect(() => {
    fetch("/api/rackets")
      .then((res) => res.json())
      .then(setRackets);
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">🏸 Racket List</h1>
      <ul className="space-y-2">
        {rackets.map((r) => (
          <li key={r.id} className="border p-3 rounded-md bg-gray-50">
            {r.brand} - {r.name} (${r.price})
          </li>
        ))}
      </ul>
    </main>
  );
}
