"use client";

import { AddColumn } from "@/components/main/add-column";
import { EditTableDialog } from "@/components/main/edit-table";
import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { Edit2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { SheetTable } from "@/components/main/sheet-table";
import { useParams, useRouter } from "next/navigation";
import { getTableData } from "@/api/table";
import { TableData } from "@/types/types";
import { ConnectSheet } from "@/components/main/connect-sheet";
import PageLoader from "@/components/page-loader";
import useWebSocket from "@/hooks/use-ws";

const SingleTable = () => {
  const { tableId } = useParams();
  const router = useRouter();
  const { state } = useSidebar();

  const [table, setTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useWebSocket(setTable);

  useEffect(() => {
    if (!tableId) router.push("/tables");

    const fetchTable = async () => {
      setLoading(true);
      const response = await getTableData(tableId as string);
      if (response.success) {
        setTable(response.data);
      } else {
        setError(response.data);
      }
      setLoading(false);
    };

    fetchTable();
  }, [tableId, router]);

  if (loading) return <PageLoader />;
  if (error) return router.push("/tables");

  return (
    <div className="p-3 flex flex-1 flex-col gap-4 max-w-[1200px] w-full lg:w-full mx-auto overflow-hidden">
      <div className="flex items-center gap-2.5">
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
              {table?.tableName || "Table Name"}
            </span>
          </RoughNotation>
        </h1>
        <EditTableDialog
          triggerLabel={<Edit2 size={20} cursor={"pointer"} />}
          tableName={table!.tableName}
          tableId={table!.tableId}
          setTable={setTable}
        />
      </div>
      <Card className="rounded-md p-2 flex-row items-center justify-between">
        <AddColumn triggerLabel="Add Column" tableId={table!.tableId} />
        {table?.googleSheetId ? (
          <Card className="p-1.5 flex-row items-center gap-1.5 rounded-md">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium">
              {table?.googleSheetId ? "Sheet Connected" : "Not Connected"}
            </p>
          </Card>
        ) : (
          <ConnectSheet
            triggerLabel="Connect Sheet"
            tableId={table!.tableId}
            setTable={setTable}
          />
        )}
      </Card>
      <Card className="flex-1 overflow-hidden py-2 px-[1%]">
        <SheetTable columns={table?.columns || []} />
      </Card>
    </div>
  );
};

export default SingleTable;
