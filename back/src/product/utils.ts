const getFinalStatus = (statuses) => {
  const statusCount = {};

  statuses.forEach((status) => {
    if (status in statusCount) {
      statusCount[status]++;
    } else {
      statusCount[status] = 1;
    }
  });

  const sortedStatuses = Object.keys(statusCount).sort(
    (a, b) => statusCount[b] - statusCount[a]
  );

  return sortedStatuses[0];
};

export default getFinalStatus