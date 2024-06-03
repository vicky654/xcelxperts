
type StationStatusOption = {
  id: string;
  name: string;
};


export const monthOptions = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' },
];

export const activeInactiveOption: StationStatusOption[] = [
  {
    "id": "0",
    "name": "In Active",
  },
  {
    "id": "1",
    "name": "Active",
  },
]