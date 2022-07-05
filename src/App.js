import { useEffect, useContext, createContext, useState } from 'react'
import { genDaysArr, formatDate, capitalize, calendarData, leapYear, addLeadingZero } from './utils'
import { styles } from './css'

const CalendarContext = createContext()

const RenderCell = ({data}) => {

  const { state, setState } = useContext(CalendarContext)
  const { header, day, year, month } = data
  const { provinces } = state.holidays
  const { holidays } = provinces.find((iter) => {
    return iter.id === state.provinces[state.currentProvince].abbrev
   })

  let holidayFound = undefined
  const cellDate = `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`
  holidayFound = day ? holidays.find((iter) => cellDate === iter.date) : undefined
  const bg =  state.selectedDate.getDate() === day
  ? {backgroundColor: 'rgba(255, 219, 88, 0.5)'} : {}
  const greyOut = day ? {} : {backgroundColor: 'lightgrey', 'cursor': 'auto'}
  const currentDay = formatDate(state.currentDate) ===
  cellDate ? {backgroundColor: 'rgba(228, 107, 103, 0.4)'} : {}
  const cellStyle = {
    ...styles.cellStyle,
    ...currentDay,
    ...bg,
    ...greyOut,
  }

  const cellClick = () => {
    if (!day) { return }
    const selectedDate = new Date(state.selectedDate)
    selectedDate.setDate(day)
    setState({
      ...state,
      selectedDate
    })
  }

  return (
    <div onClick={cellClick} style={cellStyle}>
      <div style={styles.innerCell}>
        <div>{header ? capitalize(header) : ''}</div>
        <div>{day ? day : ''}</div>
        <div>{holidayFound ? holidayFound.nameEn : ''}</div>
      </div>
    </div>
  )
}

const RenderCells = () => {

 const { state, setState} = useContext(CalendarContext)
 const { selectedDate } = state

 if (!selectedDate) { return }

 const monthInt = selectedDate.getMonth() + 1
 const month = Object.entries(calendarData.months).find((iter) => {
    return iter[1].order === monthInt ? true : false
 })

 const cells = (header, days) => {
  const ym = {
    year: selectedDate.getFullYear() ,
    month: selectedDate.getMonth() + 1
  }
  return (
    <div style={styles.flexRow}>
      <RenderCell data={{...ym, day: days[0], header: header ? 'sunday': ''}}/>
      <RenderCell data={{...ym, day: days[1], header: header ? 'monday': ''}}/>
      <RenderCell data={{...ym, day: days[2], header: header ? 'tuesday': ''}}/>
      <RenderCell data={{...ym, day: days[3], header: header ? 'wednesday': ''}}/>
      <RenderCell data={{...ym, day: days[4], header: header ? 'thursday': ''}}/>
      <RenderCell data={{...ym, day: days[5], header: header ? 'friday': ''}}/>
      <RenderCell data={{...ym, day: days[6], header: header ? 'saturday': ''}}/>
    </div>
  )
 }

const monthOrder = addLeadingZero(month[1].order)
const dateStr = `${state.selectedDate.getFullYear()}-${monthOrder}-01T00:00:00`
const firstDay = new Date(dateStr).getDay()
const rows = genDaysArr(month[1].days, firstDay, leapYear(state.selectedDate.getFullYear()))

const onArrowClick = (direction) => {
  const selectedDate = new Date(state.selectedDate)
  const month = selectedDate.getMonth()
  selectedDate.setDate(1)
  selectedDate.setMonth(month + (1 * (direction === 'left' ? -1 : 1)))
  setState({
    ...state,
    selectedDate
  })
}

const sorted =  Object.entries(state.provinces).sort((textA,textB) => (textA < textB) ? -1 : (textA > textB) ? 1 : 0)
const options = sorted.map((iter) => {
  return <option value={iter[0]}>{iter[1].properText || iter[0]}</option>
})

 return (
    <div style={styles.flexC}>
      {<div style={styles.flexRow}>
        <h2 onClick={() => {onArrowClick('left')}} style={styles.cursorLeft}>{'<'}</h2>
        <h2 style={styles.currentMonth}>{`${capitalize(month[0])} ${state.selectedDate.getFullYear()}`}</h2>
        <h2 onClick={() => {onArrowClick('right')}} style={styles.cursorRight}>{'>'}</h2>
        <div style={{...styles.flexC, justifyContent: 'space-around'}}>
        <select onChange={({target}) => {
          setState({
            ...state,
            currentProvince: target.value,
          })
        }} style={styles.provinceSelect}>{options}</select>
        </div>
      </div>}
      <div style={styles.calendarContainer}>
        {cells(true, rows[0])}
        {cells(false, rows[1])}
        {cells(false, rows[2])}
        {cells(false, rows[3])}
        {cells(false, rows[4])}
        {cells(false, rows[5])}
      </div>
    </div>
  )
}

const Calendar = () => {

 const [state, setState] = useState({})

  useEffect(() => {
    const currentDate = new Date()
    const selectedDate = new Date(currentDate)
    const cd = currentDate

    const fetchHoliday = () => {
      fetch('https://canada-holidays.ca/api/v1/provinces')
      .then((response) => response.json())
      .then((holidays) => {
          setState({
            ...calendarData,
            month: cd.getMonth() + 1,
            currentDate,
            selectedDate,
            holidays,
          })
      })
    }
    fetchHoliday()
  }, [])

  if (!Object.keys(state).length) { return }

  return (
    <CalendarContext.Provider value={{state, setState}}>
      <div style={styles.containerStyle}>
      <h1 style={{paddingRight: 20}}>{'Calendar App'}</h1>
      <div style={styles.flexRow}>
      <h1 style={{cursor: 'pointer', fontSize: 16}} onClick={() => {
        setState({
          ...state,
          selectedDate: new Date(state.currentDate),
        })
      }}>{'Current Date: ' + formatDate(state.currentDate)}</h1>
      </div>
      <RenderCells />
      </div>
    </CalendarContext.Provider>
  )

}

export default Calendar
