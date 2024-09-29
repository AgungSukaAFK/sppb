export default function Home() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center flex-col gap-5">
      <h1 className="w-full text-center text-3xl font-bold">
        Hello nextjs, again
      </h1>
      <a
        href="/auth"
        className="py-2 px-4 bg-slate-600 text-white rounded-md transition duration-300 hover:shadow-lg"
      >
        Login here
      </a>
    </div>
  );
}
