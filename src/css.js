const styles = {}

styles.flexC = {
 display: 'flex',
 flexDirection: 'column',
}
styles.cursorLeft = {
  cursor: 'pointer',
  paddingRight: 10
}
styles.cursorRight = {
  cursor: 'pointer',
  paddingLeft: 10
}
styles.flexRow = {
  display: 'flex',
  flexDirection: 'row'
}
styles.cellStyle = {
  cursor: 'pointer',
  width: 120,
  height: 120,
  textAlign: 'center',
  outline: '2px solid black',
  border: '2px solid black',
  backgroundColor: 'rgba(101, 174, 110, 0.4)',
}
styles.currentMonth = {
  width: 200, textAlign: 'center'
}
styles.containerStyle = {
  width: 'fit-content',
  padding: 20,
  fontFamily: 'Arial, Helvetica, sans-serif',
  border: '10px solid grey'
}
styles.calendarContainer = {
  border: '5px solid lightgrey',
  width: 'fit-content'
}
styles.provinceSelect = {
  marginLeft: 40,
  height: 20,
}
styles.innerCell = {
  ...styles.flexC,
  justifyContent: 'space-around',
  height: '100%'
}

export { styles }
