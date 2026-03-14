import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
         Multimodal stress detection
      </h1>
      <Link href="/chat" className="ml-4 text-blue-500">Start Demo</Link>
    </main>
  );
}