// Updated frontend: components/Attendance.js (employee side - time window adjusted)
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './Attendance.css';

// Use the correct backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Attendance = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [attendances, setAttendances] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // ✅ NEW: State for leave balances
    const [leaveBalances, setLeaveBalances] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found');
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const attendanceRes = await axios.get(`${API_BASE_URL}/api/attendance`, config);
                setAttendances(attendanceRes.data);

                const holidaysRes = await axios.get(`${API_BASE_URL}/api/holidays`, config);
                setHolidays(holidaysRes.data);
                
                // ✅ NEW: Fetch leave balances from the backend
                const leaveBalancesRes = await axios.get(`${API_BASE_URL}/api/leave/balances`, config);
                setLeaveBalances(leaveBalancesRes.data);

            } catch (err) {
                setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
            }
        };
        fetchData();
    }, []);

    const { totalPresent, totalAbsent } = useMemo(() => {
        const year = date.getFullYear();
        const month = date.getMonth();
        let presentCount = 0;
        let absentCount = 0;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date();
        const tenAM = new Date(now);
        tenAM.setHours(10, 0, 0, 0);
        const isBefore10AM = now < tenAM;

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            if (currentDate > today) continue;

            const dayOfWeek = currentDate.getDay();
            const isHoliday = holidays.some(h => new Date(h.date).toDateString() === currentDate.toDateString());

            if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) continue;

            // For today, if before 10 AM, don't count as absent
            if (currentDate.toDateString() === today.toDateString() && isBefore10AM) {
                continue;
            }

            const attendance = attendances.find(a => new Date(a.date).toDateString() === currentDate.toDateString());

            if (attendance && attendance.status === 'present') {
                presentCount++;
            } else {
                absentCount++;
            }
        }
        return { totalPresent: presentCount, totalAbsent: absentCount };
    }, [attendances, holidays, date]);

    const tileClassName = ({ date, view }) => {
        if (view !== 'month') return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date();
        const tenAM = new Date(now);
        tenAM.setHours(10, 0, 0, 0);
        const isBefore10AM = now < tenAM;

        const dayOfWeek = date.getDay();
        const isHoliday = holidays.some(h => new Date(h.date).toDateString() === date.toDateString());

        if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) {
            return 'weekend-holiday';
        }

        const attendance = attendances.find(a => new Date(a.date).toDateString() === date.toDateString());

        // For today, if before 10 AM, no class (blank/pending)
        if (date.toDateString() === today.toDateString() && isBefore10AM) {
            return null;
        }

        if (attendance) {
            if (attendance.status === 'present') {
                return 'present'; 
            }
            if (attendance.status === 'absent' && date <= today) {
                return 'absent';
            }
        }

        if (!attendance && date < today) {
            return 'absent';
        }

        return null;
    };

    const markPresent = async () => {
        try {
            const now = new Date();

            const startTime = new Date();
            startTime.setHours(10, 0, 0, 0);
            const endTime = new Date();
            endTime.setHours(12, 30, 0, 0);

            if (now < startTime || now > endTime) {
                setMessage("⏰ You can only mark present between 10:00 AM and 12:30 PM.");
                return;
            }

            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${API_BASE_URL}/api/attendance/mark`,
                { date: now.toISOString(), status: "present" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const todayString = now.toDateString();
            const updatedAttendances = attendances.filter(a => new Date(a.date).toDateString() !== todayString);

            setAttendances([...updatedAttendances, { date: now.toISOString(), status: "present" }]);
            setMessage(res.data.message || "✅ Marked Present for today!");

        } catch (err) {
            setMessage(err.response?.data?.message || "❌ Failed to mark present.");
        }
    };

    return (
        <div className="attendance-page">
            <div className="attendance-header">
                <button className="back-btn" onClick={() => navigate("/employee")}>⬅ Back</button>
                <button className="present-btn" onClick={markPresent}>✔ Present</button>
            </div>

            {message && <p className="info-msg">{message}</p>}

            <div className="left-content">
                <div className="calendar-wrapper">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileClassName={tileClassName}
                    />
                    <div className="attendance-summary">
                        <p>Total Present Days: {totalPresent}</p>
                        <p>Total Absent Days: {totalAbsent}</p>
                    </div>
                </div>

                <div className="leave-cards-wrapper">
                    <div className="card-row">
                        <div className="leave-card sick">
                            <h4>Sick Leave</h4>
                            {/* ✅ FIX: Display dynamic leave balance */}
                            <p>{leaveBalances ? leaveBalances.sick : '...'}</p>
                        </div>
                        <div className="leave-card casual">
                            <h4>Casual Leave</h4>
                             {/* ✅ FIX: Display dynamic leave balance */}
                            <p>{leaveBalances ? leaveBalances.casual : '...'}</p>
                        </div>
                    </div>
                    <div className="card-row">
                        <div className="leave-card vacation">
                            <h4>Emergency Leave</h4>
                            {/* ✅ FIX: Display dynamic leave balance */}
                            <p>{leaveBalances ? leaveBalances.emergency : '...'}</p>
                        </div>
                        <div className="leave-card other">
                            <h4>Other Leave</h4>
                            {/* ✅ FIX: Display dynamic leave balance */}
                            <p>{leaveBalances ? leaveBalances.other : '...'}</p>
                        </div>
                    </div>
                    <div className="actions">
                        <button onClick={() => navigate('/leave/apply')}>Apply for Leave</button>
                    </div>
                </div>
            </div>

            <div className="right-content">
                <div className="holiday-section">
                    <h3>Holidays</h3>
                    <ul className="holiday-list">
                        {holidays.map((holiday, index) => (
                            <li key={index}>
                                {new Date(holiday.date).toLocaleDateString()} - {holiday.name}
                            </li>
                        ))}
                    </ul>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Attendance; 