"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import type { BlogPost } from "@/lib/types";

interface BlogPostsPaginationProps {
  posts: BlogPost[];
}

const ITEMS_PER_PAGE = 6;

export default function BlogPostsPagination({ posts }: BlogPostsPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const paginatedPosts = posts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="overflow-hidden h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <Image
                  data-ai-hint="village activity"
                  src={post.coverImage}
                  width={800}
                  height={400}
                  alt={post.title}
                  className="aspect-video object-cover"
                />
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.body}</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground text-center col-span-full">
            Belum ada artikel yang dipublikasikan.
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
