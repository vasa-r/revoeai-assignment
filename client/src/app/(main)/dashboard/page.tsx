import { Search } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-3">
      <h1 className="text-xl md:text-2xl font-semibold">Your Dashboard</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 py-4 md:py-6 rounded-xl center flex-col">
          <span className="text-4xl md:text-5xl font-semibold">30</span> <br />{" "}
          <span className="text-2xl md:text-2xl font-medium">
            Table Created
          </span>
        </div>
        <div className="bg-muted/50 py-4 md:py-6 rounded-xl center flex-col">
          <span className="text-4xl md:text-5xl font-semibold">30</span> <br />{" "}
          <span className="text-2xl md:text-2xl font-medium">
            Table Created
          </span>
        </div>
        <div className="bg-muted/50 py-4 md:py-6 rounded-xl center flex-col">
          <span className="text-4xl md:text-5xl font-semibold">30</span> <br />{" "}
          <span className="text-2xl md:text-2xl font-medium">
            Table Created
          </span>
        </div>
      </div>
      <div className="border border-border p-1 px-3 md:p-2 md:px-5 md:pl-1.5 rounded-md flex items-center">
        <button className="cursor-pointer text-stat-white bg-violet-600 rounded-sm text-base md:text-lg font-medium px-1 py-1 md:px-2">
          Add Table
        </button>
        <input
          type="text"
          className="flex-1 text-lg font-medium outline-none ml-1.5 md:ml-3 border-b border-border px-1 py-1 md:px-2"
          placeholder="Search for table..."
        />
        <Search cursor={"pointer"} />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
