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

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10 text-lg">
        Loading attendance summary...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 mt-10 font-semibold">
        Error: {error}
      </p>
    );
  if (!summary)
    return (
      <p className="text-center text-gray-500 mt-10">
        No attendance data available.
      </p>
    );

  // Check if summary has employeeId and weeklyAttendanceCount properties
  if (summary.employeeId && summary.weeklyAttendanceCount !== undefined) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          Attendance Summary
        </h2>
        <table className="w-full table-auto border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700">
              <th className="border px-4 py-2 text-left">Employee ID</th>
              <th className="border px-4 py-2 text-left">
                Weekly Attendance Count
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-indigo-50 transition-colors duration-200">
              <td className="border px-4 py-2">{summary.employeeId}</td>
              <td className="border px-4 py-2">{summary.weeklyAttendanceCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // If summary is an array of entries (like older formats)
  if (Array.isArray(summary)) {
    if (summary.length === 0) {
      return (
        <p className="text-center text-gray-500 mt-10">
          No attendance data available.
        </p>
      );
    }
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          Attendance Summary
        </h2>
        <table className="w-full table-auto border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700">
              <th className="border px-4 py-2 text-left">Employee ID</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Time</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((entry, idx) => (
              <tr
                key={idx}
                className="hover:bg-indigo-50 transition-colors duration-200"
              >
                <td className="border px-4 py-2">{entry.employeeId}</td>
                <td className="border px-4 py-2">{entry.employeeName}</td>
                <td className="border px-4 py-2">{entry.time}</td>
                <td className="border px-4 py-2">{entry.status}</td>
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
      return (
        <p className="text-center text-gray-500 mt-10">
          No attendance data available.
        </p>
      );
    }
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          Attendance Summary
        </h2>
        {dates.map((date) => {
          const entries = summary[date];
          if (!Array.isArray(entries) || entries.length === 0) {
            return (
              <div key={date} className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-indigo-600">{date}</h3>
                <p className="text-gray-500">No attendance data available for this date.</p>
              </div>
            );
          }
          return (
            <div key={date} className="mb-8">
              <h3 className="font-semibold text-lg mb-2 text-indigo-600">{date}</h3>
              <table className="w-full table-auto border border-gray-300 rounded-md">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-700">
                    <th className="border px-4 py-2 text-left">Employee ID</th>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Time</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="border px-4 py-2">{entry.employeeId}</td>
                      <td className="border px-4 py-2">{entry.employeeName}</td>
                      <td className="border px-4 py-2">{entry.time}</td>
                      <td className="border px-4 py-2">{entry.status}</td>
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
  return (
    <p className="text-center text-gray-500 mt-10">
      No attendance data available.
    </p>
  );
};

export default AttendanceSummary;
