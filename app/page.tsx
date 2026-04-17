import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">
         Multimodal stress detection
      </h1>
      <>
        <Link href="/chat" className="ml-4 text-blue-500 p-2 mt-8
         border border-white/50 rounded-xl">Start Demo</Link>
      </>
      
    </main>
  );
}