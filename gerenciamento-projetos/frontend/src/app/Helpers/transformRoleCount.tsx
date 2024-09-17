// export const transformRoleCounts = (roleCounts: RoleCount[]): DataItem[] => {
//   return roleCounts.map(item => ({
//     _id: item._id,
//     label: item._id,
//     count: item.count,
//     color: `hsl(${Math.random() * 360}, 70%, 50%)`
//   }));
// };

// // src/Helpers/transformRoleCount.ts

export const transformRoleCounts = (data: { _id: string, count: number }[]) => {
  // Define colors for the chart
  const colors = [
    "hsl(295, 70%, 50%)", // Define more colors as needed
    "hsl(120, 70%, 50%)",
    "hsl(86, 70%, 50%)",
    "hsl(3, 70%, 50%)"
  ];

  return data.map((role, index) => ({
    id: role._id,
    label: role._id,
    value: role.count,
    color: colors[index % colors.length] // Cycle through colors
  }));
};
