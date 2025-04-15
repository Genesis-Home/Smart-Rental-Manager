export const _weekGet = (current: Date): Date[] => {
  const week: Date[] = [];
  // Starting Monday not Sunday
  current.setDate(current.getDate() - current.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return week;
};

export const _getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const date = new Date(startDate.getTime());
  const dates: Date[] = [];
  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
};
