"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DeadlineIcon } from "@/components/Icons";

const EXAM_DATA: Record<string, { title: string; rules: string[] }> = {
  "web-tech": {
    title: "Web Technologies Final",
    rules: [
      "Access to MDN and React Documentation is permitted.",
      "Project must be initialized with Vite or Next.js.",
      "Ensure all components are accessible (Aria-labels).",
      "Final code must be pushed to the provided GitHub Classroom link."
    ],
  },
  "data-science": {
    title: "Data Science Midterm",
    rules: [
      "Standard scientific calculators are the only permitted hardware.",
      "Submission must be a single .ipynb file with all cells cleared.",
      "Interpretations of visualizations must be written in Markdown.",
      "Datasets will be distributed via USB or secure download."
    ],
  }
};

function GuidelinesContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "web-tech";
  const exam = EXAM_DATA[type] || EXAM_DATA["web-tech"];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm font-medium text-stone-400">
        <Link href="/exams" className="hover:text-stone-600 transition-colors">
          Upcoming Exams
        </Link>

        <span>/</span>

        <Link
          href={`/exams?type=${type}`}
          className="hover:text-stone-600 transition-colors"
        >
          {exam.title}
        </Link>

        <span>/</span>

        <span className="text-stone-800 font-bold">Guidelines</span>
      </nav>

      <div className="bg-white p-12 rounded-3xl border border-stone-100 shadow-sm max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-50">
             <DeadlineIcon size={32} />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 leading-tight">{exam.title}</h2>
          <p className="text-stone-500 mt-2 font-medium border-b border-stone-50 pb-6 inline-block w-full">
            Official Examination Policy
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">
            Mandatory Requirements
          </h4>
          <ul className="space-y-5">
            {exam.rules.map((rule, i) => (
              <li key={i} className="flex items-start text-stone-600 text-sm leading-relaxed italic">
                <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ExamGuidelinesPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-stone-400">Loading Guidelines...</div>}>
      <GuidelinesContent />
    </Suspense>
  );
}
