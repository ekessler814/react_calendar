const leapYear = (year) => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);

const calendarData = { months: {
    january: {days: 31, order: 1},
    february: {days: 28, order: 2},
    march: {days: 31, order: 3},
    april: {days: 30, order: 4},
    may: {days: 31, order: 5},
    june: {days: 30, order: 6},
    july: {days: 31, order: 7},
    august: {days: 31, order: 8},
    september: {days: 30, order: 9},
    october: {days: 31, order: 10},
    november: {days: 30, order: 11},
    december: {days: 31, order: 12},
  }, currentDate: undefined, selectedDate: undefined, holidays: undefined,
  provinces: {
    Alberta : {
      abbrev: 'AB'
    },
    BritishColumbia: {
      abbrev: 'BC',
      properText: 'British Columbia'
    },
    Manitoba: {
      abbrev: 'MB',
      properText: 'Manitoba'
    },
    Quebec: {
      abbrev: 'QC',
      properText: 'Quebec'
    },
    NewBrunswick: {
      abbrev: 'NB',
      properText: 'New Brunswick'
    },
    PrinceEdwardIsland: {
      abbrev: 'PE',
      properText: 'Prince Edward Island'
    },
    NovaScotia: {
      abbrev: 'NS',
      properText: 'Nova Scotia'
    },
    Saskatchewan: {
      abbrev: 'SK',
      properText: 'Saskatchewan',
    },
    Ontario: {
      abbrev: 'ON',
      properText: 'Ontario',
    },
    Newfoundland: {
        abbrev: 'NL',
        properText: 'Newfoundland',
    },
    NorthWestTerritories: {
      abbrev: 'NT',
      properText: 'Northwest Territories',
    },
    Nunavut: {
      abbrev: 'NU',
      properText: 'Nunavut',
    },
    Yukon: {
      abbrev: 'YT',
      properText: 'Yukon',
    },
  }, currentProvince: 'Alberta'
}

const addLeadingZero = (num) =>  num < 10 ? '0' + num : num

 const capitalize = (s) => {
    return s[0].toUpperCase() + s.slice(1);
}

const formatDate = (d) => {
  const mPlus = d.getMonth() + 1
  const month = mPlus < 10 ? '0' + mPlus : mPlus
  const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  return `${d.getFullYear()}-${month}-${day}`
}

const genDaysArr = (days, firstDay, leap) => {
  const row1 = []
  const row2 = []
  const row3 = []
  const row4 = []
  const row5 = []
  const row6 = []
  let iter = 1
  const leaped = days === 28 && leap ? 29 : days
  for (let i = 1; i <= leaped; i++) {
    if (iter > leaped) { break }
    if (i + firstDay <= 7) {
      row1.push(iter)
    } else if (i + firstDay <= 14) {
      row2.push(iter)
    } else if (i + firstDay <= 21) {
      row3.push(iter)
    } else if (i + firstDay <= 28) {
      row4.push(iter)
    } else if (i + firstDay <= 35) {
      row5.push(iter)
    } else if (i + firstDay <= 42) {
      row6.push(iter)
    }
    iter ++
  }
  while (row1.length < 7) {
    row1.unshift(0)
  }
  while (row5.length < 7) {
    row5.push(0)
  }
  while (row6.length < 7) {
    row6.push(0)
  }
  return [row1, row2, row3, row4, row5, row6]
}

export {genDaysArr, formatDate, capitalize, calendarData, leapYear, addLeadingZero}
