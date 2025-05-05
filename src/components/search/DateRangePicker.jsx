import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

function DateRangePicker({ ranges, onChange, onClose, disabledDates }) {
  return (
    <div className="p-4 date-range-picker">
      <DateRange
        ranges={ranges}
        onChange={onChange}
        months={1}
        direction="horizontal"
        showDateDisplay={true}
        showMonthAndYearPickers={true}
        rangeColors={['#FF5A5F']}
        minDate={new Date()}
        disabledDates={disabledDates}
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-airbnb-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}

export default DateRangePicker