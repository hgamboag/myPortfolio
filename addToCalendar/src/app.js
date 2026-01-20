const form = document.getElementById('calendarForm');
const emailBtn = document.getElementById('emailBtn');
const refreshBtn = document.getElementById('refreshBtn');

/* Clear form */
function clearForm() {
  form.reset();
}

/* Create ICS file */
function createICS({ title, date, startTime, endTime, description, location }) {
  const start = `${date.replace(/-/g, '')}T${startTime.replace(':', '')}00`;
  const end = `${date.replace(/-/g, '')}T${endTime.replace(':', '')}00`;

  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${start}
DTEND:${end}
DESCRIPTION:${description || ''}
LOCATION:${location || ''}
END:VEVENT
END:VCALENDAR`;
}

/* Add to calendar */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    title: title.value,
    date: date.value,
    startTime: startTime.value,
    endTime: endTime.value,
    description: description.value,
    location: location.value
  };

  const ics = createICS(data);
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'event.ics';
  a.click();

  URL.revokeObjectURL(url);
  clearForm();
});

/* Send by email */
emailBtn.addEventListener('click', () => {
  const subject = encodeURIComponent(title.value);
  const body = encodeURIComponent(
    `Event: ${title.value}
Date: ${date.value}
From: ${startTime.value} to ${endTime.value}
Location: ${location.value}
Description: ${description.value}`
  );

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  clearForm();
});

/* Refresh button */
refreshBtn.addEventListener('click', clearForm);
