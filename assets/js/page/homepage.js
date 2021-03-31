const calendarEl = document.getElementById('schedule');

const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'timeGridWeek',
  height: 'auto',
  nowIndicator: true,
  allDaySlot: false,
  locale: 'fi',
  weekNumbers: true,
  firstDay: 1,
  weekText: "Vko",
  allDayDefault: true,
  headerToolbar: {
    start: '', // will normally be on the left. if RTL, will be on the right
    center: 'title',
    end: 'prev,next' // will normally be on the right. if RTL, will be on the left
  },
  weekends: false
})

calendar.render()