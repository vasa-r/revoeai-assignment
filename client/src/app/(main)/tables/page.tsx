"use client";

import { TableList } from "@/components/main/table-list";
import PageLoader from "@/components/page-loader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useStats } from "@/context/stat-context";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { RoughNotation } from "react-rough-notation";

const AllTables = () => {
  const { state } = useSidebar();
  const { stats, loading } = useStats();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTables = stats.tableStats.filter((table) =>
    table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div className="p-3 flex flex-1 flex-col gap-4">
      <h1 className="text-xl md:text-2xl font-semibold">
        <RoughNotation
          type="highlight"
          animate
          show
          color="#7f22fe"
          animationDuration={1000}
          key={state}
        >
          <span className="text-2xl font-bold text-white inline-flex">
            Your Tables
          </span>
        </RoughNotation>
      </h1>
      <Card className="py-0.5 md:w-[40%] rounded-md flex-row items-center px-1.5 md:px-2 gap-0">
        <Search />
        <Input
          className="border-none"
          placeholder="Search for tables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>
      <Card className="flex-1 rounded-md overflow-y-auto md:px-[3%] md:py-2">
        <TableList tables={filteredTables} />
      </Card>
    </div>
  );
};

export default AllTables;
