import * as data from './data.js';

export function getLastDay(date){
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getFirstDay(date){
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function changeMonthValue(date, off){
    return new Date(date.getFullYear(), date.getMonth()+off, 1);
}

export function makeCurrentMonthInfo(){
    const CalendarStandardDay = data.getStandardDate();
    return `${CalendarStandardDay.getMonth()+1}월 ${CalendarStandardDay.getFullYear()}년`;
}

export function getLastWeek(calendarElement){
    const tbody_calendar = calendarElement.querySelector('tbody');
    const tr_weeks = tbody_calendar.querySelectorAll('tr');
    
    return tr_weeks[tr_weeks.length-1];
}

export function makeIdByDate(dateObj, date){
    return `${dateObj.getFullYear()}-${addZeroIfOneDigit(dateObj.getMonth()+1) }-${addZeroIfOneDigit(date)}`; 
}

export function addZeroIfOneDigit(number){
    return (number < 10 ) ? '0'+number : number;
}

export function isToday(date){
    return data.today.getDate() === date 
          && data.today.getMonth() === data.getStandardDate().getMonth() 
          && data.today.getFullYear() === data.getStandardDate().getFullYear();
  }

export function isSameMonth(date, CalendarStandardDay){
    let dateValue = date.split('-');
    let yearValue = dateValue[0];
    let monthValue = dateValue[1];
    
    if( monthValue.charAt(0) === '0') {
        monthValue = monthValue.charAt(1);
    }
    return Number(monthValue-1) === CalendarStandardDay.getMonth()
            && Number(yearValue) === CalendarStandardDay.getFullYear();
}