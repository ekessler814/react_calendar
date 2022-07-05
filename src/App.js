import { useEffect, useContext, createContext, useState } from 'react'
import { genDaysArr, formatDate, capitalize, calendarData, leapYear, addLeadingZero } from './utils'
import { styles } from './css'

// initialize context for state and setState to live
const CalendarContext = createContext()


 /* Renders individual calendar cell representing day, data contains
 date information about the day the cell is representing */
const RenderCell = ({data}) => {

 // load state from context
  const { state, setState } = useContext(CalendarContext)


  /* header should only be rendered for the top row of cells in the
  calendar. It shows the day of the week the column of cells pertains to
  day, year, month are all in string format */
  const { header, day, year, month } = data

  const { provinces } = state.holidays


  /* search our holiday data retrieved from public api for currently selected provinces
  since that is how the data is segregated */
  const { holidays } = provinces.find((iter) => {
    return iter.id === state.provinces[state.currentProvince].abbrev
   })


  /* format our date information so it can be compared to the text based format coming
  from our public api  */
  const cellDate = `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`

  // search json for our particular day to see if there is a holiday
  const holidayFound = day ? holidays.find((iter) => cellDate === iter.date) : undefined

  // cs style for selected day, turns cell yellow
  const bg =  state.selectedDate.getDate() === day
  ? {backgroundColor: 'rgba(255, 219, 88, 0.5)'} : {}

  // cs style for unused date cell, turns cell grey
  const greyOut = day ? {} : {backgroundColor: 'lightgrey', 'cursor': 'auto'}

  // cs style for current date, turns cell red
  const currentDay = formatDate(state.currentDate) ===
  cellDate ? {backgroundColor: 'rgba(228, 107, 103, 0.4)'} : {}

  // order of destructuring is purposeful - greyOut overrides currentDate for ex.
  const cellStyle = {
    ...styles.cellStyle,
    ...currentDay,
    ...bg,
    ...greyOut,
  }

  /* Click handler for clicking the cell. Right now you are able to select a cell
 but there is no additional functionality other than highlighting it yellow */
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
        {/* Render cell contents */}
        <div>{header ? capitalize(header) : ''}</div>
        <div>{day ? day : ''}</div>
        <div>{holidayFound ? holidayFound.nameEn : ''}</div>
      </div>
    </div>
  )
}

// Renders a single horizontal row of cells for our calendar
const RenderCells = () => {

 // load props from context rather than passing as function parameters
 const { state, setState} = useContext(CalendarContext)

 const { selectedDate } = state

 // if no date is selected yet return nothing, data is not yet initialized
 if (!selectedDate) { return }

 const monthInt = selectedDate.getMonth() + 1

  /* iterate our hardcoded json data for our calendar month based on int
 representation of the month */
 const monthObj = Object.entries(calendarData.months).find((iter) => {
    return iter[1].order === monthInt ? true : false
 })

 /*  function that renders one row of cells, passing props pertaining
 to which individual dateStr the cell is representing. Days contains a
 full row of seven individual days (or inactive fillter cells)  */
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

// format date infromation in order to generate Date object and determine day of the week
const monthOrder = addLeadingZero(monthObj[1].order)
const dateStr = `${state.selectedDate.getFullYear()}-${monthOrder}-01T00:00:00`
const firstDay = new Date(dateStr).getDay()

/* use our util function genDaysArr to split days into grid of 42 cells with filler
0's for cells that aren't being used by the current month/year being displayed */
const rows = genDaysArr(monthObj[1].days, firstDay, leapYear(state.selectedDate.getFullYear()))

/* click handlers for clicking left and right arrows to either increment or decrement the current month */
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

// sort hard coded object of provinces alphabetically
const sorted =  Object.entries(state.provinces).sort((textA,textB) => (textA < textB) ? -1 : (textA > textB) ? 1 : 0)

// geneate select options for provinces
const options = sorted.map((iter) => {
  return <option value={iter[0]}>{iter[1].properText || iter[0]}</option>
})

 return (
    <div style={styles.flexC}>
      {<div style={styles.flexRow}>

        {/* arrows for month increment and decrement as well as current month h2 */}
        <h2 onClick={() => {onArrowClick('left')}} style={styles.cursorLeft}>{'<'}</h2>
        <h2 style={styles.currentMonth}>{`${capitalize(monthObj[0])} ${state.selectedDate.getFullYear()}`}</h2>
        <h2 onClick={() => {onArrowClick('right')}} style={styles.cursorRight}>{'>'}</h2>

        {/* province selector box */}
        <div style={{...styles.flexC, justifyContent: 'space-around'}}>
        <select onChange={({target}) => {
          setState({
            ...state,
            currentProvince: target.value,
          })
        }} style={styles.provinceSelect}>{options}</select>
        </div>
      </div>}

      {/* single entire grid of cells */}
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

  // intialize state and setState as empty object
 const [state, setState] = useState({})

  useEffect(() => {
    const currentDate = new Date()
    const selectedDate = new Date(currentDate)
    const cd = currentDate

    /* fetch holiday data for Canada for the current year.
    Data is segregated by province */
    const fetchHoliday = () => {
      fetch('https://canada-holidays.ca/api/v1/provinces')
      .then((response) => response.json())
      .then((holidays) => {
          /* Initialize state with the response of our api fetch and hardcoded
          calendar data from utils */
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

  // If state is not yet initialized then return nothing
  if (!Object.keys(state).length) { return }

  return (
    <CalendarContext.Provider value={{state, setState}}>
      {/* Pass state and setState to children using context*/}
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
