import * as utils from './utils.js';

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
let firstDayOfThisMonth = utils.getFirstDay(CalendarStandardDay);
let lastDayOfThisMonth = utils.getLastDay(CalendarStandardDay);

export function changeStandardDate(newDate){
    CalendarStandardDay = newDate;
    firstDayOfThisMonth = utils.getFirstDay(CalendarStandardDay);
    lastDayOfThisMonth = utils.getLastDay(CalendarStandardDay);
}
export function getStandardDate(){
    return CalendarStandardDay;
}

export { holidays, todoItems, firstDayOfThisMonth, lastDayOfThisMonth, today}