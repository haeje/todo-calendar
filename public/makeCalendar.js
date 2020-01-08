import makeCalendarFrame from './makeCalendarFrame.js'
import * as utils from './utils.js';
import * as data from './data.js';


export default function makeCalendar(calendar){
    makeCalendarFrame(calendar);
    makeThisMonth(calendar);
}

// 달력 프레임을 makeCalendarFrame로 만든 후, 비어있는 각 DOM 노드에 
// date 정보를 셋팅하는 코드
export function makeThisMonth(calendarElement){
    setCalendarHeader(calendarElement);
    makeDateThisMonth(calendarElement);
    connectHolidayInfo(calendarElement);
    connectTodoItems(calendarElement);
    
}
function setCalendarHeader(calendarElement){
    const calendarTitle = calendarElement.querySelector("#thisMonthTitle");
    calendarTitle.innerText = utils.makeCurrentMonthInfo();
}

function makeDateThisMonth(calendarElement){
    const CalendarStandardDay = data.getStandardDate();
    makePreMonthDayInfo(calendarElement, CalendarStandardDay);
    makeCurrentMonthDayInfo(calendarElement, CalendarStandardDay);
    makeNextMonthDayInfo(calendarElement, CalendarStandardDay);
}

function makePreMonthDayInfo(calendarElement, CalendarStandardDay){
    const tr_weeks = calendarElement.querySelectorAll('tr');
    const tr_firstWeek = tr_weeks[0];

    const td_days = tr_firstWeek.querySelectorAll('td');
    const dateForId = utils.changeMonthValue(CalendarStandardDay, -1);
    
    const preMonthLastDate = new Date(CalendarStandardDay.getFullYear(), CalendarStandardDay.getMonth(), 0).getDate();
    let dateOfPreMonth = startDateOfPreMonth(preMonthLastDate);
    
    let idx_day = 0;
    while( dateOfPreMonth <= preMonthLastDate ){
        const td_dayColumn = td_days[idx_day];
        const id_attr = utils.makeIdByDate(dateForId, dateOfPreMonth);
        
        setCommonDayAttr(td_dayColumn, id_attr);
        setNotThisMonthAttr(td_dayColumn);
        setDateHeader(td_dayColumn, dateOfPreMonth, CalendarStandardDay);
        
        idx_day++;
        dateOfPreMonth++;
        
    }
}
function startDateOfPreMonth(preMonthLastDate){
    const firstDayOfThisMonth_idx = data.firstDayOfThisMonth.getDay();
    return preMonthLastDate - firstDayOfThisMonth_idx + 1;
}
function setCommonDayAttr(tdElement, id_attr){
    tdElement.setAttribute('id', id_attr);
}
function setNotThisMonthAttr(tdElement){
    tdElement.classList.add('not-this-month');
}
function setDateHeader(tdElement, date, CalendarStandardDay){
    const span_date = tdElement.querySelector('.date')
    span_date.innerText = date;

    if( utils.isToday(date) ) span_date.classList.add('today')    
}

function makeCurrentMonthDayInfo(calendarElement, CalendarStandardDay){
    const tbody_calendar = calendarElement.querySelector('tbody');
    const tr_weeks = tbody_calendar.querySelectorAll('tr');

    let tr_targetWeek = tr_weeks[0];
    let td_days = tr_targetWeek.querySelectorAll('td');
    let idx_day = data.firstDayOfThisMonth.getDay();
    
    for( let date = 1, week = 0 ; date <= data.lastDayOfThisMonth.getDate() ; date++ ){
        const td_dayColumn = td_days[idx_day];
        const id_attr = utils.makeIdByDate(CalendarStandardDay, date);

        setCommonDayAttr(td_dayColumn, id_attr);
        setDateHeader(td_dayColumn, date, CalendarStandardDay);

        idx_day++;
        if( isEndOfThisWeek(idx_day) ){
            idx_day = 0;
            tr_targetWeek = tr_weeks[++week];
            if( week < tr_weeks.length ) td_days = tr_targetWeek.querySelectorAll('td');
        }
    }
}
function isEndOfThisWeek(idx_day){
    return idx_day === 7;
}

function makeNextMonthDayInfo(calendarElement, CalendarStandardDay){
    const tr_week  = utils.getLastWeek(calendarElement);
    const td_days = tr_week.querySelectorAll('td');

    const dateForId = utils.changeMonthValue(CalendarStandardDay, 1);
    
    const lastDay = data.lastDayOfThisMonth.getDay();
    const availableDateCount = 7 - (lastDay+1);
    let idx_day = lastDay + 1;
    for (let dateOfNextMonth = 1; dateOfNextMonth < availableDateCount; dateOfNextMonth++) {
        const td_dayColumn = td_days[idx_day];
        const id_attr = utils.makeIdByDate(dateForId, dateOfNextMonth);
        
        setCommonDayAttr(td_dayColumn, id_attr);
        setNotThisMonthAttr(td_dayColumn);
        setDateHeader(td_dayColumn, dateOfNextMonth, CalendarStandardDay);

        idx_day++;
        dateOfNextMonth++;
    }
    
}

// holidays 데이터 view에 셋팅하는 부분
function connectHolidayInfo(calendarElement){
    data.holidays.forEach(holiday=>{
        if(utils.isSameMonth(holiday.date, data.getStandardDate())){
            const spanHoliday = document.getElementById(holiday.date).querySelector('.holiday');
            spanHoliday.innerText = holiday.event;
        }
    })
}

// todoItems 데이터 view에 셋팅하는 부분
function connectTodoItems(calendarElement){
    Object.keys(data.todoItems).forEach(date=>{
        if(utils.isSameMonth(date, data.getStandardDate())){
            const dateElement = document.getElementById(date);
            const content = dateElement.querySelector('.date-content');
            const todoList = content.querySelector('ul');

            data.todoItems[date].forEach(todo=>{
                const liElement = document.createElement('li');
                liElement.innerText = todo;
                todoList.appendChild(liElement);
            })
        }
    })
    
}