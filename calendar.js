const holidays = [
    {
        "date": "2020-01-05",
		"event": "자소설닷컴 테스팅" 
    },
	{
		"date": "2019-10-01",
		"event": "국군의날"
	},
	{
		"date": "2019-10-03",
		"event": "개천절"
	},
	{
		"date": "2019-10-09",
		"event": "한글날"
	},
	{
		"date": "2019-11-05",
		"event": "학생 독립의 날"
	},
	{
		"date": "2019-10-25",
		"event": "친구와 약속"
	},
	{
		"date": "2019-10-14",
		"event": "와인데이"
	},
	{
		"date": "2019-10-25",
		"event": "데브톡"
	},
	{
		"date": "2019-11-09",
		"event": "소방의 날"
	},
	{
		"date": "2019-11-05",
		"event": "친구 약속"
	},
	{
		"date": "2019-11-08",
		"event": "입동"
	}
]
const todoItems = {
    "2020-01-05":['test'],
    "2020-01-08":['d-day']
}

const today = new Date();
let CalendarStandardDay = new Date();
let firstDayOfThisMonth = new Date(CalendarStandardDay.getFullYear(), CalendarStandardDay.getMonth(), 1);
let lastDayOfThisMonth = new Date(CalendarStandardDay.getFullYear(), CalendarStandardDay.getMonth() + 1, 0);

function makeCalendar(){
    const calendar = document.querySelector('#calendar');
    makeCalendarFrame(calendar);
    makeThisMonth(calendar);
}

function makeThisMonth(calendarElement){
    
    setCalendarHeader(calendarElement);
    makeDateThisMonth(calendarElement);
    connectHolidayInfo(calendarElement);
    connectTodoItems(calendarElement);
    
}
function setCalendarHeader(calendarElement){
    const calendarTitle = calendarElement.querySelector(".thisMonthTitle");
    calendarTitle.innerText = makeCurrentMonthInfo(CalendarStandardDay);
}

// 리팩토링 요소
function makeDateThisMonth(calendarElement){
    makePreMonthDayInfo(calendarElement);
    makeCurrentMonthDayInfo(calendarElement);
    makeNextMonthDayInfo(calendarElement);
}

// 현재 createElement로 calendar 프레임을 만드는 부분과 '일' 정보를 계산하는 과정이 같이 있음.
function makePreMonthDayInfo(calendarElement){
    const tbody_calendar = calendarElement.querySelector('tbody');
    const tr_weeks = tbody_calendar.querySelectorAll('tr');
    const tr_firstWeek = tr_weeks[0];
    const td_days = tr_firstWeek.querySelectorAll('td');
    const dateForId = changeMonthOffset(-1);
    
    const firstDayOfThisMonth_idx = firstDayOfThisMonth.getDay();
    const preMonthLastDate = new Date(CalendarStandardDay.getFullYear(), CalendarStandardDay.getMonth(), 0).getDate();
    
    let dateOfPreMonth = preMonthLastDate - firstDayOfThisMonth_idx + 1;
    
    let idx_day = 0;
    while( dateOfPreMonth <= preMonthLastDate ){
        const td_dayColumn = td_days[idx_day];
        const id_attr = makeId(dateForId, dateOfPreMonth);
        
        setCommonAttr(td_dayColumn, id_attr);
        setNotThisMonthAttr(td_dayColumn);
        setDateHeader(td_dayColumn, id_attr, dateOfPreMonth, CalendarStandardDay);
        
        idx_day++;
        dateOfPreMonth++;
        
    }
}
function changeMonthOffset(off){
    return new Date(CalendarStandardDay.getFullYear(), CalendarStandardDay.getMonth()+off, CalendarStandardDay.getDate());
}
function makeId(dateObj, date){
    return `${dateObj.getFullYear()}-${addZeroIfOneDigit(dateObj.getMonth()+1) }-${addZeroIfOneDigit(date)}`; 
}
function addZeroIfOneDigit(number){
    return (number < 10 ) ? '0'+number : number;
}
function setCommonAttr(tdElement, id_attr){
    tdElement.setAttribute('id', id_attr);
}
function setNotThisMonthAttr(tdElement){
    tdElement.classList.add('not-this-month');
}
function setDateHeader(tdElement, id_attr, date, CalendarStandardDay){

    const span_addTodoIcon = tdElement.querySelector('.add-todo-icon')
    span_addTodoIcon.addEventListener('click', function(event){
        event.stopPropagation();
        openAddModal(id_attr);
    })

    const span_date = tdElement.querySelector('.date')
    span_date.innerText = date;

    if( isToday(date, today, CalendarStandardDay)) span_date.classList.add('today')    
}
function openAddModal(id_attr){
    const modal = document.querySelector('.modal');
    modal.querySelector('input[type="date"]').value=id_attr;
    modal.classList.remove('hidden');
    
}
function isToday(date, today, CalendarStandardDay){
  return today.getDate() === date 
        && today.getMonth() === CalendarStandardDay.getMonth() 
        && today.getFullYear() === CalendarStandardDay.getFullYear();
}
function makeDateContent(tdElement){
    const div_dateContent = document.createElement('div');
    div_dateContent.classList.add('date-content');
    const todoList = document.createElement('ul');
    div_dateContent.appendChild(todoList);
    tdElement.appendChild(div_dateContent);
}
function processingWeekend(idx_day, td_dayColumn){
    if( isWeekend(idx_day) ){
        td_dayColumn.classList.add('weekend');
    }
}
function isWeekend(idx_day){
    return idx_day === 0 || idx_day === 6;
}

function makeCurrentMonthDayInfo(calendarElement){
    const tbody_calendar = calendarElement.querySelector('tbody');
    const tr_weeks = tbody_calendar.querySelectorAll('tr');

    let tr_targetWeek = tr_weeks[0];
    let td_days = tr_targetWeek.querySelectorAll('td');
    let idx_day = firstDayOfThisMonth.getDay();
    
    for( let date = 1, week = 0 ; date <= lastDayOfThisMonth.getDate() ; date++ ){
        const td_dayColumn = td_days[idx_day];
        const id_attr = makeId(CalendarStandardDay, date);

        setCommonAttr(td_dayColumn, id_attr);
        setDateHeader(td_dayColumn, id_attr, date, CalendarStandardDay);

        idx_day++;
        if( isEndOfThisWeek(idx_day) ){
            idx_day = 0;
            week++;
            tr_targetWeek = tr_weeks[week];
            td_days = tr_targetWeek.querySelectorAll('td');
        }
    }
}
function isEndOfThisWeek(idx_day){
    return idx_day === 7;
}

function makeNextMonthDayInfo(calendarElement){
    const tr_week  = getLastWeek(calendarElement);
    const td_days = tr_week.querySelectorAll('td');
    const idx_lastDay = lastDayOfThisMonth.getDay();
    const availableDateCount = 7 - (idx_lastDay+1);
    const dateForId = changeMonthOffset(1);;
    
    let dateOfNextMonth = 1;
    let idx_day = idx_lastDay+1;
    while( dateOfNextMonth <= availableDateCount ){
        const td_dayColumn = td_days[idx_day];
        const id_attr = makeId(dateForId, dateOfNextMonth);
        
        setCommonAttr(td_dayColumn, id_attr);
        setNotThisMonthAttr(td_dayColumn);
        setDateHeader(td_dayColumn, id_attr, dateOfNextMonth, CalendarStandardDay);

        idx_day++;
        dateOfNextMonth++;
    }
}
function getLastWeek(calendarElement){
    return calendarElement.querySelector('tr:last-child');
}




function connectHolidayInfo(calendarElement){
    holidays.forEach(holiday=>{
        if(isSameMonth(holiday.date, CalendarStandardDay)){
            const spanHoliday = document.getElementById(holiday.date).querySelector('.holiday');
            spanHoliday.innerText = holiday.event;
        }
    })
}

function connectTodoItems(calendarElement){
    Object.keys(todoItems).forEach(date=>{
        if(isSameMonth(date, CalendarStandardDay)){
            const dateElement = document.getElementById(date);
            const content = dateElement.querySelector('.date-content');
            const todoList = content.querySelector('ul');

            todoItems[date].forEach(todo=>{
                const liElement = document.createElement('li');
                liElement.innerText = todo;
                todoList.appendChild(liElement);
            })
        }
    })
    
}
function isSameMonth(date, CalendarStandardDay){
    let dateValue = date.split('-');
    let yearValue = dateValue[0];
    let monthValue = dateValue[1];
    
    if( monthValue.charAt(0) === '0') {
        monthValue = monthValue.charAt(1);
    }
    return Number(monthValue-1) === CalendarStandardDay.getMonth()
            && Number(yearValue) === CalendarStandardDay.getFullYear();
}


function makeCalendarFrame(calendar){
    
    makeCalendarHeader(calendar);
    makeCalendarContent(calendar);
    
    
    return calendar;
}
function makeCalendarHeader(calendar){
    const div_CalendarHeader = document.createElement('div');
    div_CalendarHeader.classList.add('header-calender');

    const span_toPreMonth = document.createElement('span');
    span_toPreMonth.innerHTML = '<i class="fas fa-chevron-left"></i>';
    span_toPreMonth.addEventListener('click', ()=>{ changeMonth(-1, calendar)});
    
    const span_toNextMonth = document.createElement('span');
    span_toNextMonth.innerHTML = '<i class="fas fa-chevron-right"></i>'
    span_toNextMonth.addEventListener('click', ()=>{ changeMonth(1, calendar)});

    const span_curMonthInfo = document.createElement('span');
    span_curMonthInfo.classList.add('thisMonthTitle');

    span_toPreMonth.classList.add('changeMonthIcon');
    span_toNextMonth.classList.add('changeMonthIcon');

    div_CalendarHeader.appendChild(span_toPreMonth);
    div_CalendarHeader.appendChild(span_curMonthInfo);
    div_CalendarHeader.appendChild(span_toNextMonth);
    calendar.appendChild(div_CalendarHeader);
}
function makeCalendarContent(calendar){
    const table_calendar = document.createElement('table');
    calendar.appendChild(table_calendar);
    
    makeCalendarContentHeader(table_calendar);
    makeCalendarContentBody(table_calendar);
    
}
function makeCalendarContentHeader(table_calendar){
    const thead_calendar = document.createElement('thead');
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    days.forEach( day =>{
        const th_dayHeader = document.createElement('th');
        th_dayHeader.innerText = day;
        thead_calendar.appendChild(th_dayHeader);
    });

    table_calendar.appendChild(thead_calendar);
}
function makeCalendarContentBody(table_calendar){
    const tbody_calendar = document.createElement('tbody');
    
    const cnt_weeks = calculateCountOfWeeks(CalendarStandardDay);
    for (let index = 0; index < cnt_weeks; index++) {
        const tr_week = document.createElement('tr');
        makeWeek(tr_week);
        tbody_calendar.appendChild(tr_week);
    }
    table_calendar.appendChild(tbody_calendar);
}
function calculateCountOfWeeks(CalendarStandardDay){
    const idx_startDay = CalendarStandardDay.getDay();
    const cnt_dateOfPreMonth = idx_startDay + 1;
    const cnt_dateOfThisMonth = lastDayOfThisMonth.getDate();
    const cnt_totalDate = cnt_dateOfPreMonth + cnt_dateOfThisMonth;
    const cnt_totalWeeds = Math.floor(cnt_totalDate/7);
    
    return ( cnt_totalDate % 7 !== 0) ?  cnt_totalWeeds + 1 : cnt_totalWeeds;
}
function makeWeek(tr_week){
    for (let idx_day = 0; idx_day < 7; idx_day++) {
        const td_dayColumn = document.createElement('td');
        
        td_dayColumn.classList.add('day-column');
        makeDateHeader(td_dayColumn);
        makeDateContent(td_dayColumn);
        processingWeekend(idx_day, td_dayColumn);

        td_dayColumn.addEventListener('click', function(event){
            event.stopPropagation();
            
            alertInfo(event.target.id);
        })

        tr_week.appendChild(td_dayColumn);
    }
}
function makeDateHeader(tdElement){
    const div = document.createElement('div');
    div.classList.add('date-header');

    const span_addTodoIcon = document.createElement('span');
    span_addTodoIcon.innerHTML = `<i class="fas fa-plus"></i>`;
    span_addTodoIcon.classList.add("add-todo-icon");

    const span_holiday = document.createElement('span');
    span_holiday.classList.add('holiday');

    const span_date = document.createElement('span');
    span_date.classList.add('date')

    div.appendChild(span_addTodoIcon);
    div.appendChild(span_holiday);
    div.appendChild(span_date);
    
    tdElement.appendChild(div);
}
function alertInfo(id_attr){
    alert(`
    날짜 : ${id_attr}
    ${(getHolidayInfo(id_attr)==='')?'공휴일이 아닙니다':getHolidayInfo(id_attr)}
    일정 : ${ (getTodoInfo(id_attr)) ? getTodoInfo(id_attr) : ''}
    `);
}
function getHolidayInfo(id_attr){
    let result = '';
    holidays.forEach(holiday=>{
        if( holiday.date === id_attr) {
            result = holiday.event;
        }
    })
    return result;
}
function getTodoInfo(id_attr){
    return todoItems[id_attr];
}



function changeMonth(off, calendar){
    CalendarStandardDay = changeMonthOffset(off);
    firstDayOfThisMonth = new Date(CalendarStandardDay.getFullYear(), CalendarStandardDay.getMonth(), 1);
    lastDayOfThisMonth = new Date(CalendarStandardDay.getFullYear(), CalendarStandardDay.getMonth() + 1, 0);

    calendar.querySelector('.thisMonthTitle').innerText = makeCurrentMonthInfo(CalendarStandardDay);
    makeThisMonth(calendar);
}

function makeCurrentMonthInfo(CalendarStandardDay){
    return `${CalendarStandardDay.getMonth()+1}월 ${CalendarStandardDay.getFullYear()}년`;
}
document.addEventListener("DOMContentLoaded", function(event) { 
    modalEventListner();
});

function modalEventListner(){
    
    const addNewTodoIcon = document.querySelector('.addNewTodo');
    addNewTodoIcon.addEventListener('click', addNewTodoItem);

    const text_newTodo = document.querySelector('input[name="todo"]');
    text_newTodo.addEventListener('keypress', event=>{
        if( event.key ==='Enter') addNewTodoItem();
    });


    const resetNewTodoIcon = document.querySelector('.resetNewTodo');
    resetNewTodoIcon.addEventListener('click', modalClose);

    const modalOverlay = document.querySelector('.modal-overlay');
    modalOverlay.addEventListener('click', modalClose)

    
}
function addNewTodoItem(){
    const modal = document.querySelector('.modal');
    const id_attr = modal.querySelector('input[type="date"]').value;
    let newTodoItem = modal.querySelector('input[name="todo"]');
    
    if( newTodoItem.value == "") {
        alert('할 일을 입력해주세요.');
        return;
    }
    if(!todoItems[id_attr]) todoItems[id_attr] =[];

    todoItems[id_attr].push(newTodoItem.value);
    
    const dateElement = document.getElementById(id_attr);
    const content = dateElement.querySelector('.date-content');
    const todoList = content.querySelector('ul');

    const liElement = document.createElement('li');
    liElement.innerText = newTodoItem.value;
    todoList.appendChild(liElement);

    newTodoItem.value = '';
    modalClose();

}
function modalClose(){
    const modal = document.querySelector('.modal');
    modal.classList.add('hidden');
}



makeCalendar();



