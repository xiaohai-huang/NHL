import {
  addDays,
  dateDiffInDays,
  formatDate,
  getDayStr,
} from "../../utils/date-func";

type HeaderProps = {
  start: string;
  end: string;
};
function Header({ start, end }: HeaderProps) {
  const columns = [
    { label: "Team Name", id: "teamName" },
    ...getDayColumns(start, end),
    { label: "Total GP", id: "totalGP" },
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

function getDayColumns(start: string, end: string) {
  // "2022-06-20", "2022-06-20"
  const startDate = new Date(start);
  const endDate = new Date(end);

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
