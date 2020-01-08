import * as utils from './utils.js';
import * as data from './data.js';
import * as fillInData from './makeCalendar.js';

export default function makeCalendarFrame(calendar){
    makeCalendarHeader(calendar);
    makeCalendarContent(calendar);
}
function makeCalendarHeader(calendar){
    const div_CalendarHeader = document.createElement('div');
    div_CalendarHeader.classList.add('header-calender');

    const span_toPreMonth = document.createElement('span');
    span_toPreMonth.innerHTML = '<i class="fas fa-chevron-left"></i>';
    span_toPreMonth.addEventListener('click', ()=>{ changeMonth(-1, calendar, data.getStandardDate())});
    
    const span_toNextMonth = document.createElement('span');
    span_toNextMonth.innerHTML = '<i class="fas fa-chevron-right"></i>'
    span_toNextMonth.addEventListener('click', ()=>{ changeMonth(1, calendar, data.getStandardDate())});

    const span_curMonthInfo = document.createElement('span');
    span_curMonthInfo.classList.add('thisMonthTitle');
    span_curMonthInfo.setAttribute('id', 'thisMonthTitle');

    span_toPreMonth.classList.add('changeMonthIcon');
    span_toNextMonth.classList.add('changeMonthIcon');

    div_CalendarHeader.appendChild(span_toPreMonth);
    div_CalendarHeader.appendChild(span_curMonthInfo);
    div_CalendarHeader.appendChild(span_toNextMonth);
    calendar.appendChild(div_CalendarHeader);
}
function changeMonth(off, calendar){
    let CalendarStandardDay = data.getStandardDate();
    const cnt_currentWeeks = calculateCountOfWeeks(CalendarStandardDay);
    
    CalendarStandardDay = utils.changeMonthValue(CalendarStandardDay, off);
    
    data.changeStandardDate(CalendarStandardDay);

    calendar.querySelector('#thisMonthTitle').innerText = utils.makeCurrentMonthInfo(CalendarStandardDay);

    changeFrame(calendar, cnt_currentWeeks);
    removeChildAttr(calendar.querySelector('tbody'));
    fillInData.makeThisMonth(calendar);
}
function changeFrame(calendar, cnt_currentWeeks){
    const CalendarStandardDay = data.getStandardDate();
    const cnt_changeWeeks = calculateCountOfWeeks(CalendarStandardDay);
    const distanceOfWeeks = cnt_changeWeeks - cnt_currentWeeks;

    if( distanceOfWeeks === 0) return;
    
    changeWeeks(distanceOfWeeks, calendar);
}
function changeWeeks(offset, calendar){
    if( offset > 0){
        for (let index = 0; index < offset; index++) {
            addWeek(calendar);
        }
    }else{
        offset *= -1;
        for (let index = 0; index < offset; index++) {
            removeWeek(calendar);
        }
    }
}
function addWeek(calendar){
    const tbody_calendar = calendar.querySelector('tbody');

    const tr_week = document.createElement('tr');
    makeWeek(tr_week);
    tbody_calendar.appendChild(tr_week);
}
function removeWeek(calendar){
    const tr_lastWeek = utils.getLastWeek(calendar);
    tr_lastWeek.remove();
}
function removeChildAttr(element){
    const children = element.childNodes;
    if(children.length === 0 ) return;
    if( element.nodeName === "UL") {
        element.innerHTML = "";
        return;
    }
    
    for (let index = 0; index < children.length ; index++) {
        const child = children[index];
        
        if( child.classList ) {
            child.classList.remove('not-this-month');
            child.classList.remove('today');
            if( child.classList.contains('holiday') ){
                child.innerText = "";
            }
        }

        removeChildAttr(child)
    }
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
    
    const cnt_weeks = calculateCountOfWeeks();
    
    for (let index = 0; index < cnt_weeks; index++) {
        const tr_week = document.createElement('tr');
        makeWeek(tr_week);
        tbody_calendar.appendChild(tr_week);
    }
    table_calendar.appendChild(tbody_calendar);
}
function calculateCountOfWeeks(){
    const CalendarStandardDay = data.getStandardDate();
    const idx_startDay = CalendarStandardDay.getDay();
    
    const cnt_dateOfPreMonth = idx_startDay;
    const cnt_dateOfThisMonth = utils.getLastDay(CalendarStandardDay).getDate();
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
            event.preventDefault();
            const id_attr = getDayColumnIdFromChildElement(event.target);
            
            alertInfo(id_attr);
        })

        tr_week.appendChild(td_dayColumn);
    }
}
function getDayColumnIdFromChildElement(target){
    const dataRegularExpression = /\d\d\d\d\-\d\d\-\d\d/;
    if( target.id ){
        if( dataRegularExpression.test(target.id) ) return target.id;
        else return getDayColumnIdFromChildElement(target.parentNode);
    }
    else return getDayColumnIdFromChildElement(target.parentNode);
    
}
function makeDateHeader(tdElement){
    const div = document.createElement('div');
    div.classList.add('date-header');

    const span_addTodoIcon = document.createElement('span');
    span_addTodoIcon.innerHTML = `<i class="fas fa-plus"></i>`;
    span_addTodoIcon.classList.add("add-todo-icon");
    span_addTodoIcon.addEventListener('click', function(event){
        event.stopPropagation();
        
        let target = event.target;
        let id_attr = "";
        if( target.tagName === "SPAN") id_attr = event.target.parentNode.parentNode.id;
        else if(target.tagName === "I" ) id_attr = event.target.parentNode.parentNode.parentNode.id
        
        openAddModal(id_attr);
    })
    const span_holiday = document.createElement('span');
    span_holiday.classList.add('holiday');

    const span_date = document.createElement('span');
    span_date.classList.add('date')

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
function makeDateContent(tdElement){
    const div_dateContent = document.createElement('div');
    div_dateContent.classList.add('date-content');
    const ul_todoList = document.createElement('ul');
    div_dateContent.appendChild(ul_todoList);
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

function alertInfo(id_attr){
    alert(`
    날짜 : ${id_attr}
    ${(getHolidayInfo(id_attr)==='')?'공휴일이 아닙니다':getHolidayInfo(id_attr)}
    일정 : ${ (getTodoInfo(id_attr)) ? getTodoInfo(id_attr) : ''}
    `);
}
function getHolidayInfo(id_attr){
    let result = '';
    data.holidays.forEach(holiday=>{
        if( holiday.date === id_attr) {
            result = holiday.event;
        }
    })
    return result;
}
function getTodoInfo(id_attr){
    return data.todoItems[id_attr];
}

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
    
    if( newTodoItem.value === "") {
        alert('할 일을 입력해주세요.');
        return;
    }
    if(!data.todoItems[id_attr]) data.todoItems[id_attr] =[];

    data.todoItems[id_attr].push(newTodoItem.value);
    
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

document.addEventListener("DOMContentLoaded", function(event) { 
    modalEventListner();
});