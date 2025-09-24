
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { Report } from "@/lib/types";

interface RecentReportsPaginationProps {
  reports: Report[];
}

const ITEMS_PER_PAGE = 3;

export default function RecentReportsPagination({ reports }: RecentReportsPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  const paginatedReports = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "resolved": return "default";
      case "in_progress": return "secondary";
      case "pending": return "outline";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800 border-green-300";
      case "in_progress": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "pending": return "bg-blue-100 text-blue-800 border-blue-300";
      case "rejected": return "bg-red-100 text-red-800 border-red-300";
      default: return "";
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedReports.length > 0 ? (
          paginatedReports.map((report) => (
            <Link key={report.id} href={`/report/${report.id}`} className="block">
                <Card
                className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl h-full"
                >
                <CardContent className="p-4">
                    <Image
                    data-ai-hint="damaged road"
                    src={report.photos[0]}
                    width={400}
                    height={300}
                    alt={report.title}
                    className="aspect-video w-full rounded-md object-cover mb-4"
                    />
                    <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg max-w-full overflow-hidden text-ellipsis break-words">
                        {report.title}
                    </h3>
                    <Badge
                        variant={getStatusVariant(report.status)}
                        className={cn(
                        "rounded-md",
                        getStatusClass(report.status)
                        )}
                    >
                        {report.status}
                    </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 break-words">
                    {report.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{report.category}</span>
                    <span>
                        {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    </div>
                </CardContent>
                </Card>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground text-center col-span-full">
            Belum ada laporan terbaru.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Math.max(1, currentPage - 1));
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(Math.min(totalPages, currentPage + 1));
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
