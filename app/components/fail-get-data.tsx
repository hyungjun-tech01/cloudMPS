import Link from "next/link";
import MaterialIcons from "@/app/components/materialIcon";

export default function FailGetData(errMsg:string, path:string) {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <MaterialIcons name="sentiment_dissatisfied" props="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">500 Internal Server Error</h2>
      <p>{errMsg}</p>
      <Link
        href={path}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
