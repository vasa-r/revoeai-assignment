import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to{" "}
          <span className="font-merienda text-extrabold text-violet-600">
            SheetSync
          </span>
        </h1>
        <p className="text-lg mb-6">
          Effortlessly sync and manage your data with Google Sheets integration.
        </p>
        <Button>
          <Link
            href="/signin"
            className="py-2 px-6 rounded-full text-lg font-semibold transition duration-300"
          >
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
}
