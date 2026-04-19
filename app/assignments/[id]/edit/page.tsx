"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAssignmentStore } from "../../../../lib/store";
import Link from "next/link";

export default function EditAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { assignments, loading, submitAssignment, removeSubmission } = useAssignmentStore();
  const assignment = assignments.find((a) => a.id === id);

  const [comment, setComment] = useState("");
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    if (assignment?.submission) {
      setComment(assignment.submission.comment);
      setNewFileName(assignment.submission.fileName);
    }
  }, [assignment]);

  async function handleUpdateSubmit(prevState: any, formData: FormData) {
    const currentComment = formData.get("comment") as string;
    const file = formData.get("file") as File;
    
    const fileName = (file && file.name !== "") ? file.name : (assignment?.submission?.fileName || "existing-file.pdf");

    submitAssignment(id, {
      fileName: fileName,
      comment: currentComment
    });

    // Return to the assignment detail page after saving
    router.push(`/assignments/${id}`);
    return { success: true };
  }

  const [state, formAction, isPending] = useActionState(handleUpdateSubmit, null);

  const handleRemove = () => {
    if (confirm("Are you sure you want to remove this submission? This will revert the status to Pending and remove it from your activity.")) {
      removeSubmission(id);
      router.push(`/assignments/${id}`);
    }
  };

  if (loading) return <div className="p-8 text-stone-500">Loading...</div>;
  if (!assignment) return <div className="p-8 text-red-500">Assignment not found.</div>;
  
  if (assignment.status !== 'Submitted') {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-stone-600 font-medium">This assignment hasn't been submitted yet.</p>
        <Link href={`/assignments/${id}`} className="text-[#F9A825] font-bold hover:underline">
          ← Back to Assignment
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-stone-500">
        <Link href="/assignments" className="hover:underline">Assignments</Link>
        <span className="mx-2">/</span>
        <Link href={`/assignments/${id}`} className="hover:underline">{assignment.title}</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-900 font-medium">Edit Submission</span>
      </nav>

      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Edit Submission</h2>
            <p className="text-stone-500 mt-1">{assignment.title} • {assignment.course}</p>
          </div>
          <button 
            onClick={handleRemove}
            className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl border border-red-100 transition-colors"
          >
            Remove Submission
          </button>
        </div>

        <form action={formAction} className="space-y-6">
           {/* Current File Info */}
           <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Current File</p>
                <p className="text-sm font-bold text-stone-800">{newFileName}</p>
              </div>
            </div>
            <label htmlFor="new-file" className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer">
              Change File
            </label>
            <input 
              type="file" 
              name="file" 
              id="new-file" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files?.[0]) setNewFileName(e.target.files[0].name);
              }}
            />
          </div>

          {/* Comment Area */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-stone-800">Comment / Description</label>
            <textarea 
              name="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any notes about your submission..."
              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-[#F9A825] transition-all text-sm resize-none"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              type="submit"
              disabled={isPending}
              className="flex-1 py-4 bg-[#F9A825] text-white font-bold rounded-2xl shadow-lg shadow-amber-100 hover:bg-[#D97706] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            {/* Cancel returns to the assignment detail page */}
            <Link 
              href={`/assignments/${id}`}
              className="px-8 py-4 bg-stone-100 text-stone-600 font-bold rounded-2xl hover:bg-stone-200 transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
