const onCheckDiffDateDays = (date1: Date, date2: Date) => {
  const diff = date1.getTime() - date2.getTime();
  const days = Math.ceil(Math.abs(diff) / (1000 * 3600 * 24));

  return days;
};

export default onCheckDiffDateDays;
