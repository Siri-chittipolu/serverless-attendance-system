import React, { useEffect, useState } from "react";

const API_URL = "https://8xouin3h8h.execute-api.ap-south-1.amazonaws.com/prod/getAttendanceSummary?employeeId=emp004";

const AttendanceSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading attendance summary...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!summary) return <p>No attendance data available.</p>;

  // Check if summary has employeeId and weeklyAttendanceCount properties
  if (summary.employeeId && summary.weeklyAttendanceCount !== undefined) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Attendance Summary</h2>
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Employee ID</th>
              <th className="border px-2 py-1">Weekly Attendance Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">{summary.employeeId}</td>
              <td className="border px-2 py-1">{summary.weeklyAttendanceCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // If summary is an array of entries (like older formats)
  if (Array.isArray(summary)) {
    if (summary.length === 0) {
      return <p>No attendance data available.</p>;
    }
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Attendance Summary</h2>
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Employee ID</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((entry, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{entry.employeeId}</td>
                <td className="border px-2 py-1">{entry.employeeName}</td>
                <td className="border px-2 py-1">{entry.time}</td>
                <td className="border px-2 py-1">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // If summary is an object keyed by dates (older format)
  if (summary && typeof summary === "object") {
    const dates = Object.keys(summary);
    if (dates.length === 0) {
      return <p>No attendance data available.</p>;
    }
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Attendance Summary</h2>
        {dates.map((date) => {
          const entries = summary[date];
          if (!Array.isArray(entries) || entries.length === 0) {
            return (
              <div key={date} className="mb-6">
                <h3 className="font-semibold text-lg mb-2">{date}</h3>
                <p>No attendance data available for this date.</p>
              </div>
            );
          }
          return (
            <div key={date} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{date}</h3>
              <table className="w-full border border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Employee ID</th>
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Time</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{entry.employeeId}</td>
                      <td className="border px-2 py-1">{entry.employeeName}</td>
                      <td className="border px-2 py-1">{entry.time}</td>
                      <td className="border px-2 py-1">{entry.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  }

  // Default fallback
  return <p>No attendance data available.</p>;
};

export default AttendanceSummary;
