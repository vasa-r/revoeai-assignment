"use client";

import AddTableModal from "@/components/add-table";
import { HomeTable } from "@/components/main/home-table";
import PageLoader from "@/components/page-loader";
import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { useStats } from "@/context/stat-context";
import { Search } from "lucide-react";
import { useState } from "react";
import { RoughNotation } from "react-rough-notation";

export default function Page() {
  const { state } = useSidebar();
  const { stats, loading } = useStats();
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <PageLoader />;

  const filteredTables = stats.tableStats.filter((table) =>
    table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-3">
      <h1 className="text-xl md:text-2xl font-semibold">
        <RoughNotation
          type="highlight"
          animate
          show
          color="#7f22fe"
          animationDuration={1000}
          key={state}
        >
          <span className="text-2xl font-bold text-white">Your Dashboard</span>
        </RoughNotation>
      </h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="bg-muted/50 py-4 md:py-6 rounded-md center flex-col gap-0">
          <span className="text-4xl md:text-5xl font-semibold">
            {stats.totalTables ?? 0}
          </span>{" "}
          <br />{" "}
          <span className="text-2xl md:text-2xl font-medium">
            Table Created
          </span>
        </Card>
        <Card className="bg-muted/50 py-4 md:py-6 rounded-md center flex-col gap-0">
          <span className="text-4xl md:text-5xl font-semibold">
            {stats.totalColumns ?? 0}
          </span>{" "}
          <br />{" "}
          <span className="text-2xl md:text-2xl font-medium">
            Columns Created
          </span>
        </Card>
        <Card className="bg-muted/50 py-4 md:py-6 rounded-md center flex-col gap-0">
          <span className="text-4xl md:text-5xl font-semibold">
            {stats.totalGoogleSheetsLinked ?? 0}
          </span>{" "}
          <br />{" "}
          <span className="text-2xl md:text-2xl font-medium">
            Sheets Linked
          </span>
        </Card>
      </div>
      <div className="border border-border p-1 px-3 md:p-2 md:px-5 md:pl-1.5 rounded-md flex items-center">
        <AddTableModal triggerLabel="Add Table" />
        <input
          type="text"
          className="flex-1 text-lg font-medium outline-none ml-1.5 md:ml-3 border-b border-border px-1 py-1 md:px-2"
          placeholder="Search for table..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search cursor={"pointer"} />
      </div>
      <Card className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min py-0 md:px-[5%] md:py-2">
        <HomeTable tables={filteredTables} />
      </Card>
    </div>
  );
}
