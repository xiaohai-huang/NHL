import { Dispatch, SetStateAction, useState } from "react";

import {
  addDays,
  dateDiffInDays,
  formatDate,
  getDayStr,
} from "../../utils/date-func";
import Switch from "../Switch";

type HeaderProps = {
  start: string;
  end: string;
  setSortKeys: Dispatch<SetStateAction<{ key: string; ascending: boolean }[]>>;
};

function Header({ start, end, setSortKeys }: HeaderProps) {
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(false);
  const [totalOffNights, setTotalOffNights] = useState(false);

  const columns = [
    { label: "Team Name", id: "teamName" },
    ...getDayColumns(start, end),
    {
      label: (
        <>
          Total GP
          <Switch
            style={{ marginLeft: "2px" }}
            checked={totalGamesPlayed}
            onClick={() => {
              setTotalGamesPlayed((prev) => !prev);
              setSortKeys((prev) => {
                const keys = [...prev];
                keys.pop();
                return [
                  { key: "totalGamesPlayed", ascending: totalGamesPlayed },
                  ...keys,
                ];
              });
            }}
          />
        </>
      ),
      id: "totalGamesPlayed",
    },
    {
      label: (
        <>
          Total Off-Nights
          <Switch
            style={{ marginLeft: "2px" }}
            checked={totalOffNights}
            onClick={() => {
              setTotalOffNights((prev) => !prev);
              setSortKeys((prev) => {
                const keys = [...prev];
                keys.pop();
                return [
                  { key: "totalOffNights", ascending: totalOffNights },
                  ...keys,
                ];
              });
            }}
          />
        </>
      ),
      id: "totalOffNights",
    },
  ];

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.id}>{column.label}</th>
        ))}
      </tr>
    </thead>
  );
}

/**
 * Parse a date string as a Date obj. Ignore current hh-mm-ss
 * @param dateStr e.g., "2022-06-13"
 */
export function parseDateStr(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function getDayColumns(start: string, end: string) {
  // "2022-06-20", "2022-06-20"
  const startDate = parseDateStr(start);
  const endDate = parseDateStr(end);

  const days = dateDiffInDays(startDate, endDate);
  const columns = [] as { label: JSX.Element | string; id: string }[];
  let current = startDate;
  for (let i = 0; i <= days; i++) {
    columns.push({
      label: (
        <>
          {getDayStr(current)}
          <br /> {formatDate(current)}
        </>
      ),
      id: getDayStr(current),
    });
    current = addDays(current, 1);
  }

  return columns;
}

export default Header;
