"use client";

import ActivitySVG from "@/assets/activity.svg";
import AnnouncementSVG from "@/assets/announcement.svg";
import CalendarSVG from "@/assets/calendar.svg";
import ClockSVG from "@/assets/clock.svg";
import GradeSVG from "@/assets/grade.svg";
import SearchSVG from "@/assets/search.svg";
import UploadSVG from "@/assets/upload.svg";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useAssignmentStore } from "@/lib/store";
import { AnnouncementsIcon } from "@/components/Icons";
import { ActivityIcon } from "@/components/Icons";
import { DeadlineIcon } from "@/components/Icons";

const courses: Course[] = [
  {
    id: 1,
    title: "Advanced Web Development",
    instructor: "Dr. Sarah Miller",
    progress: 75,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    instructor: "Prof. Alan Turing",
    progress: 40,
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=300&q=80",
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "UI/UX Design Systems",
    instructor: "Jane Cooper",
    progress: 90,
    thumbnail:
      "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&w=300&q=80",
    color: "bg-pink-500",
  },
];

const deadlines: Deadline[] = [
  {
    id: 1,
    title: "Final Project Submission",
    course: "Advanced Web Dev",
    date: "Apr 12, 2026",
    priority: "High",
  },
  {
    id: 2,
    title: "Quiz 4: Neural Networks",
    course: "Machine Learning",
    date: "Apr 15, 2026",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Design Critique",
    course: "UI/UX Design",
    date: "Apr 18, 2026",
    priority: "Low",
  },
];

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Easter Break Schedule",
    date: "2 hours ago",
    author: "Academic Office",
    content: "The university will be closed from Friday to Monday...",
  },
  {
    id: 2,
    title: "New Library Resources",
    date: "1 day ago",
    author: "Academic Office",
    content: "Access to IEEE Xplore is now available for all students...",
  },
];

function DashboardCourseItem({ course }: { course: Course }) {
  return (
    <div
      key={course.id}
      className="min-w-[320px] bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer overflow-hidden"
    >
      <div className="h-40 overflow-hidden relative">
        <Image
          src={course.thumbnail}
          alt={course.title}
          width={1024}
          height={1024}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-700 shadow-sm">
            {course.instructor}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h4 className="font-bold text-stone-800 text-lg leading-tight mb-4 group-hover:text-[#F9A825] transition-colors">
          {course.title}
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-400 font-medium tracking-wide">
              PROGRESS
            </span>
            <span className="text-stone-900 font-bold">{course.progress}%</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${course.color} transition-all duration-1000 ease-out`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCourseOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const processedCourses = useMemo(() => {
    return [...courses]
      .filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "progress":
            return b.progress - a.progress;
          default:
            return 0;
        }
      });
  }, [searchQuery, sortBy]);

  return (
    <section>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-stone-800 whitespace-nowrap">
          Course Overview
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-50">
            <span className="absolute inset-y-0 left-3 flex items-center">
              <Image
                src={SearchSVG}
                alt="Search Icon"
                width={15}
              />
            </span>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-[#F9A825] transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
          >
            <option value="title">Sort: Course (A-Z)</option>
            <option value="title-desc">Sort: Course (Z-A)</option>
            <option value="progress">Sort: Progress</option>
          </select>

          <button className="px-4 py-2 bg-[#F9A825] text-white text-xs font-bold rounded-xl hover:bg-[#D97706] transition-all shadow-sm shadow-amber-100 whitespace-nowrap">
            View All
          </button>
        </div>
      </div>
      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {processedCourses.map((course) => (
          <DashboardCourseItem
            key={course.id}
            course={course}
          />
        ))}
        {processedCourses.length === 0 && (
          <div className="w-full py-12 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
            <p className="text-stone-400 font-medium">
              No courses found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function DashboardAnnouncementItem({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <div
      key={announcement.id}
      className="group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-sm font-bold text-stone-800 group-hover:text-[#F9A825] transition-colors">
          {announcement.title}
        </h4>
        <span className="text-[10px] font-semibold text-stone-400 uppercase">
          {announcement.date}
        </span>
      </div>
      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
        {announcement.content}
      </p>
      <div className="mt-3 border-b border-stone-50 group-last:border-none" />
    </div>
  );
}

function DashboardAnnouncementWidget() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-stone-800">Announcements</h3>
        <span className="bg-stone-50 p-2 rounded-xl border border-stone-100">
          <AnnouncementsIcon size={20} />
        </span>
      </div>
      <div className="space-y-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-stone-800 group-hover:text-amber-500 transition-colors">
                {item.title}
              </h4>
              <span className="text-[10px] font-semibold text-stone-400 uppercase">
                {item.date}
              </span>
            </div>
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {item.content}
            </p>
            <div className="mt-3 border-b border-stone-50 group-last:border-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardRecentActivityItem({ activity }: { activity: Activity }) {
  return (
    <div
      key={activity.id}
      className="flex space-x-4"
    >
      <div className="mt-1">
        <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
          <Image
            src={activity.type === "grade" ? GradeSVG : UploadSVG}
            alt="Activity Icon"
            width={20}
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-stone-800">{activity.title}</h4>
          <span className="text-[10px] font-semibold text-stone-400">
            {activity.time}
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">{activity.detail}</p>
      </div>
    </div>
  );
}

function DashboardRecentActivityWidget() {
  const { activities, loading } = useAssignmentStore();

  if (loading) {
    return <div className="p-8 text-stone-500">Loading activities...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-stone-800">Recent Activity</h3>
        <span className="bg-stone-50 p-2 rounded-xl border border-stone-100">
          <ActivityIcon size={20} />
        </span>
      </div>
      
      <div className="space-y-6">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex space-x-4">
              <div className="mt-1">
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center">
                  <ActivityIcon size={16} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-stone-800">{activity.title}</h4>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    {activity.time}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{activity.detail}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-stone-400 text-center py-4 italic">No recent activity.</p>
        )}
      </div>
    </div>
  );
}


function DashboardDeadlineItem() {
  return (
    <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm sticky top-28">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-stone-800">Deadlines</h3>
        <div className="w-10 h-10 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100">
          <DeadlineIcon size={24} />
        </div>
      </div>

      <div className="space-y-6">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="flex group cursor-pointer items-start space-x-4"
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full mt-1.5 ${
                  deadline.priority === "High"
                    ? "bg-red-500"
                    : deadline.priority === "Medium"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              />
              <div className="w-0.5 flex-1 bg-stone-100 mt-2 group-last:hidden" />
            </div>
            <div className="flex-1 pb-6 group-last:pb-0 border-b border-stone-50 group-last:border-none">
              <h4 className="text-sm font-bold text-stone-800 group-hover:text-amber-500 transition-colors">
                {deadline.title}
              </h4>
              <p className="text-xs text-stone-400 mt-1 font-medium">
                {deadline.course}
              </p>
              <div className="flex items-center mt-3 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                {/* Updated: Mini version of the DeadlineIcon for the timeline */}
                <DeadlineIcon size={14} />
                <span className="ml-1.5">{deadline.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-4 bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-stone-100 hover:bg-amber-600 hover:-translate-y-0.5 transition-all duration-300">
        View All Deadlines
      </button>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-(--breakpoint-2xl) mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
          Welcome back, Lebron!
        </h2>
        <p className="text-stone-500 mt-1">
          Here&apos;s what&apos;s happening with your courses today.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        <div className="xl:col-span-2 space-y-8">
          <DashboardCourseOverview />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DashboardAnnouncementWidget />
            <DashboardRecentActivityWidget />
          </div>
        </div>

        <aside className="xl:sticky xl:top-8 h-fit">
          <DashboardDeadlineItem />
        </aside>

      </div>
    </div>
  );
}