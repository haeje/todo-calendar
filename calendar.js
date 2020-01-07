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
    const calendarElement = makeCalendarFrame(calendar);
    makeThisMonth(calendarElement);
}

function makeThisMonth(calendarElement){
    if( calendarElement.querySelector('tbody') ) // 달이 변경될 때는 현재 달의 element node가 존재하므로, 기존의 table node 삭제
        calendarElement.querySelector('tbody').remove(); 
    
    const tbody = document.createElement('tbody');
    calendarElement.querySelector('table').appendChild(tbody);
    
    makeDateThisMonth(calendarElement);
    connectHolidayInfo(calendarElement);
    connectTodoItems(calendarElement);
    
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
    let tr_week = document.createElement('tr');
    
    const firstDayOfThisMonth_idx = firstDayOfThisMonth.getDay();
    const preMonthlastDate = new Date(CalendarStandardDay.getFullYear(), CalendarStandardDay.getMonth(), 0).getDate();
    
    let dateOfPreMonth = preMonthlastDate - firstDayOfThisMonth_idx + 1;
    
    let idx_day = 0;
    while( dateOfPreMonth <= preMonthlastDate ){
        const td_dayColumn = document.createElement('td');
        const dateForId = changeMonthOffset(-1);
        const id_attr = makeId(dateForId, dateOfPreMonth);
        
        settingDateAttr(td_dayColumn, id_attr);
        makeDateHeader(td_dayColumn, id_attr, dateOfPreMonth, CalendarStandardDay);
        makeDateContent(td_dayColumn);
        
        processingWeekend(idx_day, td_dayColumn);
        idx_day++;
        
        dateOfPreMonth++;
        
        td_dayColumn.classList.add('not-this-month');
        tr_week.appendChild(td_dayColumn);
    }

    tbody_calendar.appendChild(tr_week);
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
function settingDateAttr(tdElement, id_attr){
    tdElement.setAttribute('id', id_attr);
    tdElement.classList.add('day-column');
}
function makeDateHeader(tdElement, id_attr, date, CalendarStandardDay){
    const div = document.createElement('div');
    div.classList.add('date-header');

    const span_addTodoIcon = document.createElement('span');
    span_addTodoIcon.innerHTML = `<i class="fas fa-plus"></i>`;
    span_addTodoIcon.classList.add("add-todo-icon");
    span_addTodoIcon.addEventListener('click', function(event){
        event.stopPropagation();
        openAddModal(id_attr);
    })

    const span_holiday = document.createElement('span');
    span_holiday.classList.add('holiday');

    const span_date = document.createElement('span');
    span_date.classList.add('date')
    span_date.innerText = date;
    // span_date.innerText = id_attr;

    if( isToday(date, today, CalendarStandardDay)) span_date.classList.add('today')    

    div.appendChild(span_addTodoIcon);
    div.appendChild(span_holiday);
    div.appendChild(span_date);
    
    tdElement.appendChild(div);
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
function processingWeekend(date, td_dayColumn){
    if( isWeekend(date) ){
        td_dayColumn.classList.add('weekend');
    }
}
function isWeekend(idx_day){
    return idx_day === 0 || idx_day === 6;
}
// 리팩토링 요소
function makeCurrentMonthDayInfo(calendarElement){
    const tbody = calendarElement.querySelector('tbody');

    let idx_day = firstDayOfThisMonth.getDay();
    let tr_week = getFirstWeek(calendarElement);

    for( let date = 1 ; date <= lastDayOfThisMonth.getDate() ; date++ ){
        const td_dayColumn = document.createElement('td');
        const id_attr = makeId(CalendarStandardDay, date);
        
        td_dayColumn.addEventListener('click', function(event){
            event.stopPropagation();
            alertInfo(id_attr);
        })

        settingDateAttr(td_dayColumn, id_attr);
        makeDateHeader(td_dayColumn, id_attr, date, CalendarStandardDay);
        makeDateContent(td_dayColumn);

        processingWeekend(idx_day, td_dayColumn);
        
        tr_week.appendChild(td_dayColumn);
        
        idx_day++;
        if( isEndOfThisWeek(idx_day) ){
            idx_day = 0;
            tbody.appendChild(tr_week);
            tr_week = document.createElement('tr');
        }
    }
    tbody.appendChild(tr_week);
}
function getFirstWeek(calendarElement){
    return calendarElement.querySelector('tbody > tr');
}
function isEndOfThisWeek(idx_day){
    return idx_day === 7;
}
// 리팩토링 요소
function makeNextMonthDayInfo(calendarElement){
    const tr_week  = getLastWeek(calendarElement);
    
    const idx_lastDay = lastDayOfThisMonth.getDay();
    const availableDateCount = 7 - (idx_lastDay+1);
    const dateForId = changeMonthOffset(1);;
    
    let dateOfNextMonth = 1;
    let idx_day = idx_lastDay+1;
    while( dateOfNextMonth <= availableDateCount ){
        const td_dayColumn = document.createElement('td');
        const id_attr = makeId(dateForId, dateOfNextMonth);
        
        td_dayColumn.classList.add('not-this-month');
        settingDateAttr(td_dayColumn, id_attr);
        makeDateHeader(td_dayColumn, id_attr, dateOfNextMonth, CalendarStandardDay);
        makeDateContent(td_dayColumn);

        processingWeekend(idx_day, td_dayColumn);
        idx_day++;

        tr_week.appendChild(td_dayColumn);
        dateOfNextMonth++;
    }
}
function getLastWeek(calendarElement){
    return calendarElement.querySelector('tr:last-child');
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
    // span_curMonthInfo.innerText = makeCurrentMonthInfo(CalendarStandardDay);

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



