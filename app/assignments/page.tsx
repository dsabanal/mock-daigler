"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAssignmentStore } from "@/lib/store";
import { Assignment } from "@/lib/data";


function StatusBadge({ status }: { status: Assignment["status"] }) {
  const styles: Record<Assignment["status"], string> = {
    Submitted: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Not Started": "bg-stone-100 text-stone-600",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function AssignmentsPage() {
  const { assignments, loading } = useAssignmentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<keyof Assignment>("title");

  const statusPriority: Record<string, number> = {
    Submitted: 1,
    "In Progress": 2,
    Pending: 3,
    "Not Started": 4,
  };
  const duePriority: Record<string, number> = {
    Tomorrow: 1,
    "In 3 days": 2,
    "Next Week": 3,
  };

  const processedAssignments = useMemo(() => {
    return assignments
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.course.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "status")
          return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
        if (sortBy === "due")
          return (duePriority[a.due] || 99) - (duePriority[b.due] || 99);
        return String(a[sortBy] || "").localeCompare(String(b[sortBy] || ""));
      });
  }, [assignments, searchQuery, statusFilter, sortBy]);

  if (loading) return <div className="p-8 text-stone-500">Loading assignments...</div>;

  return (
    <div className="p-8 max-w-(--breakpoint-2xl) mx-auto space-y-8">
      {/* Header + controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Assignments</h2>
          <p className="text-stone-500 mt-1">Click any assignment to view full details.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-stone-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-[#F9A825] transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Submitted">Submitted</option>
          </select>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof Assignment)}
              className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
            >
              <option value="title">Assignment</option>
              <option value="course">Course</option>
              <option value="due">Due Date</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Assignment</th>
              <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Course</th>
              <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Due Date</th>
              <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {processedAssignments.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-stone-50 transition-colors group"
              >
                {/* Clicking the title/description navigates to the detail page */}
                <td className="px-8 py-6">
                  <Link href={`/assignments/${item.id}`} className="block">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-stone-800 group-hover:text-[#F9A825] transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5 font-medium group-hover:text-stone-500 transition-colors">
                      Click to view details →
                    </p>
                  </Link>
                </td>
                <td className="px-8 py-6 text-stone-600 text-sm">{item.course}</td>
                <td className="px-8 py-6 text-stone-500 text-sm font-medium">{item.due}</td>
                <td className="px-8 py-6">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-8 py-6 text-right">
                  {item.status === "Submitted" ? (
                    <Link
                      href={`/assignments/${item.id}/edit`}
                      className="text-xs font-bold text-[#F9A825] hover:text-[#D97706] transition-colors border-2 border-amber-100 hover:border-amber-200 px-4 py-2 rounded-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit Submission
                    </Link>
                  ) : (
                    <Link
                      href={`/assignments/${item.id}/submit`}
                      className="text-xs font-bold text-white bg-[#F9A825] hover:bg-[#D97706] transition-colors px-4 py-2 rounded-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Submit
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {processedAssignments.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-stone-400 font-medium">No assignments found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
