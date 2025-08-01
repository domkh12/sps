import { Button, Grid2 } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import React from 'react'
import useTranslate from '../hook/useTranslate'

function DateFilterComponent({setFromDate, setToDate, fromDate, toDate}) {
  const {t} = useTranslate();

  return (
    <>
      <div className='flex p-[20px] justify-between items-center gap-5 flex-col lg:flex-row'>
        {/* Left side: Date pickers */}
        <div className='flex gap-5 flex-col w-full lg:w-auto lg:flex-row'>
            <DatePicker
              label={t("fromDate")}
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
            <DatePicker
              label={t("toDate")}
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
        </div>
        {/* Right side: Export buttons */}
        <div className='flex gap-2 flex-wrap'>   
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 1, minWidth: 120 }}
              onClick={() => {
                // TODO: Implement export PDF logic
              }}
            >
              {t("exportPDF") || "Export PDF"}
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ mr: 1, minWidth: 120 }}
              onClick={() => {
                // TODO: Implement export Excel logic
              }}
            >
              {t("exportExcel") || "Export Excel"}
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{ minWidth: 120 }}
              onClick={() => {
                // TODO: Implement export CSV logic
              }}
            >
              {t("exportCSV") || "Export CSV"}
            </Button>
        </div>
      </div>
    </>
  )
}

export default DateFilterComponent