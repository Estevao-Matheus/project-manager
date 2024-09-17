import { ResponsiveBar } from '@nivo/bar';

const MyResponsiveBarChart = ({ data }) => {
  const chartData = data.map(item => ({
    status: item.id,
    count: item.value,
    color: item.color 
  }));

  return (
    <ResponsiveBar
      data={chartData}
      keys={['count']}
      indexBy="status"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      layout="vertical"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={(bar) => bar.data.color} 
      axisLeft={{
        legend: 'Count',
        legendPosition: 'middle',
        legendOffset: -40
      }}
      axisBottom={{
        legend: 'Status',
        legendPosition: 'middle',
        legendOffset: 32
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      animate={true}
    />
  );
};

export default MyResponsiveBarChart;