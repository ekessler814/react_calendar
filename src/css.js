/* using styles stored in objects rather than css classes helps keep
logic clean and organized with minimal additional clutter in the Jsx*/

// flexbox column for app elements
const flexC = {
  display: "flex",
  flexDirection: "column",
};
const styles = {
  flexC: {
    ...flexC,
  },
  // month decrementor
  cursorLeft: {
    cursor: "pointer",
    paddingRight: 10,
  },
  // month incrementor
  cursorRight: {
    cursor: "pointer",
    paddingLeft: 10,
  },
  // flexbox row for rows of cells representing a week
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  // individual date cell
  cellStyle: {
    cursor: "pointer",
    width: 120,
    height: 120,
    textAlign: "center",
    outline: "2px solid black",
    border: "2px solid black",
    backgroundColor: "rgba(101, 174, 110, 0.4)",
  },
  // current month selector
  currentMonth: {
    width: 200,
    textAlign: "center",
  },
  // container for entire app
  containerStyle: {
    width: "fit-content",
    padding: 20,
    fontFamily: "Arial, Helvetica, sans-serif",
    border: "10px solid grey",
  },
  // container for calendar cells
  calendarContainer: {
    border: "5px solid lightgrey",
    width: "fit-content",
  },
  // selector box for provinces
  provinceSelect: {
    marginLeft: 40,
    height: 20,
  },
  // container for inner contents of day cell
  innerCell: {
    ...flexC,
    justifyContent: "space-around",
    height: "100%",
  },
};

export { styles };
