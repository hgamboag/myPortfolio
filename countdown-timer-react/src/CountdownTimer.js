import React, { useState, useEffect } from 'react';
import './style.css';

const clamp = (value, min, max) => {
  if (value === '') return '';
  const num = Number(value);
  if (isNaN(num)) return '';
  return Math.min(Math.max(num, min), max);
};

const CountdownTimer = () => {
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [second, setSecond] = useState('');
  const [timezone, setTimezone] = useState(0);

  const [timeLeft, setTimeLeft] = useState(null);
  const [started, setStarted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  /* ---------- VALIDACIÓN ---------- */
  const hourInvalid = hour !== '' && (hour < 0 || hour > 23);
  const minuteInvalid = minute !== '' && (minute < 0 || minute > 59);
  const secondInvalid = second !== '' && (second < 0 || second > 59);

  const hasErrors =
    !date || hourInvalid || minuteInvalid || secondInvalid;

  /* ---------- LOCAL STORAGE ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('cdt-data');
    if (saved) {
      const data = JSON.parse(saved);
      setDate(data.date);
      setHour(data.hour);
      setMinute(data.minute);
      setSecond(data.second);
      setTimezone(data.timezone);
      setStarted(data.started);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'cdt-data',
      JSON.stringify({ date, hour, minute, second, timezone, started })
    );
  }, [date, hour, minute, second, timezone, started]);

  /* ---------- COUNTDOWN ---------- */
  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      const h = hour === '' ? 0 : hour;
      const m = minute === '' ? 0 : minute;
      const s = second === '' ? 0 : second;

      const target = new Date(
        `${date}T${String(h).padStart(2, '0')}:${String(m).padStart(
          2,
          '0'
        )}:${String(s).padStart(2, '0')}Z`
      );
      target.setHours(target.getHours() - timezone);

      const now = new Date();
      let diff = target - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
        setTimeUp(true);
        setStarted(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff %= 1000 * 60 * 60 * 24;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff %= 1000 * 60 * 60;
      const minutes = Math.floor(diff / (1000 * 60));
      diff %= 1000 * 60;
      const seconds = Math.floor(diff / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setTimeUp(false);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, date, hour, minute, second, timezone]);

  const startCountdown = () => {
    if (hasErrors) return;
    setStarted(true);
    setTimeUp(false);
  };

  const resetAll = () => {
    setDate('');
    setHour('');
    setMinute('');
    setSecond('');
    setTimezone(0);
    setStarted(false);
    setTimeLeft(null);
    setTimeUp(false);
    localStorage.removeItem('cdt-data');
  };

  return (
 <div className="timer-wrapper">
  <div className="timer-card">
        <h2 className="text-center mb-4">⏳ Countdown Timer</h2>

        {/* DATE */}
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className={`form-control ${!date ? 'is-invalid' : ''}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {!date && <div className="invalid-feedback">Date is required</div>}
        </div>

        {/* TIME INPUTS */}
        <div className="row">
          <div className="col">
            <label className="form-label">Hour</label>
            <input
              type="number"
              className={`form-control ${hourInvalid ? 'is-invalid' : ''}`}
              placeholder="0 - 23"
              value={hour}
              onKeyDown={(e) => e.key === '-' && e.preventDefault()}
              onChange={(e) => setHour(clamp(e.target.value, 0, 23))}
            />
            {hourInvalid && (
              <div className="invalid-feedback">Hour must be 0–23</div>
            )}
          </div>

          <div className="col">
            <label className="form-label">Minute</label>
            <input
              type="number"
              className={`form-control ${minuteInvalid ? 'is-invalid' : ''}`}
              placeholder="0 - 59"
              value={minute}
              onKeyDown={(e) => e.key === '-' && e.preventDefault()}
              onChange={(e) => setMinute(clamp(e.target.value, 0, 59))}
            />
            {minuteInvalid && (
              <div className="invalid-feedback">Minute must be 0–59</div>
            )}
          </div>

          <div className="col">
            <label className="form-label">Second</label>
            <input
              type="number"
              className={`form-control ${secondInvalid ? 'is-invalid' : ''}`}
              placeholder="0 - 59"
              value={second}
              onKeyDown={(e) => e.key === '-' && e.preventDefault()}
              onChange={(e) => setSecond(clamp(e.target.value, 0, 59))}
            />
            {secondInvalid && (
              <div className="invalid-feedback">Second must be 0–59</div>
            )}
          </div>
        </div>

        {/* TIMEZONE */}
        <div className="mt-3">
          <label className="form-label">Time Zone</label>
          <select
            className="form-select"
            value={timezone}
            onChange={(e) => setTimezone(Number(e.target.value))}
          >
            <option value={-8}>UTC -8</option>
            <option value={-5}>UTC -5</option>
            <option value={0}>UTC 0</option>
            <option value={1}>UTC +1</option>
            <option value={2}>UTC +2</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="d-flex gap-2 mt-4">
          <button
            className="btn btn-primary w-100"
            disabled={hasErrors}
            onClick={startCountdown}
          >
            Start
          </button>
          <button className="btn btn-outline-danger w-100" onClick={resetAll}>
            Reset
          </button>
        </div>

        {/* RESULT */}
        {timeLeft && (
          <div className="text-center mt-4">
            <h3 className="timer-display">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
              {timeLeft.seconds}s
            </h3>
            <p className="running">⏳ Time is running…</p>
          </div>
        )}

        {timeUp && (
          <h1 className="time-up text-center mt-4">⏰ Your time is up!</h1>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
