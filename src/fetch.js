import { useEffect, useState } from "react";
import { calendarData } from './utils'
export const fetchHoliday = async () => {
  /* fetch holiday data for Canada for the current year.
  Data is segregated by province */
  const fetched = await fetch("https://canada-holidays.ca/api/v1/provinces").catch((e) => {  })

  if (!fetched.ok) {
     return Promise.reject(fetched);
  }
  const holidays = await fetched.json()
  return holidays
};

export const useFetch = () => {
  const [state, setState] = useState({loading: true});

  useEffect(() => {
    const currentDate = new Date();
    const selectedDate = new Date(currentDate);
    const cd = currentDate;
    let error = false
    const handleFetch = async () => {

      let holidays = {}
      holidays = await fetchHoliday().catch((err) => {
        error = true
      })
      /* Initialize state with the response of our api fetch and hardcoded
      calendar data from utils */
      setState({
        ...calendarData,
        month: cd.getMonth() + 1,
        currentDate,
        selectedDate,
        holidays,
        error,
        loading: false,
      });
    }
    handleFetch()
  }, []);
  return { state, setState }
}
