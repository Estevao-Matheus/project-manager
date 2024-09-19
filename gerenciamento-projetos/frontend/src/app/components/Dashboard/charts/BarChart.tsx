import { ResponsiveBar, BarTooltipProps } from '@nivo/bar';

interface BarChartData {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface MyResponsiveBarProps {
  data: BarChartData[];
}

const MyResponsiveBarChart: React.FC<MyResponsiveBarProps> = ({ data }) => {
  const chartData = data.map(item => ({
    status: item.id,
    count: item.value,
    color: item.color,
  }));

  // Custom Tooltip to show the status (e.g., Usuario, Administrador)
  const CustomTooltip = ({ indexValue, value, color }: BarTooltipProps) => (
    <div
      style={{
        padding: '6px 12px',
        background: 'black',
        color: 'white',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: color,
          marginRight: '8px',
        }}
      />
      <strong>{indexValue}</strong>: {value}
    </div>
  );

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
        legendOffset: -40,
        tickTextColor: '#ffffff',
        legendTextColor: '#ffffff',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: value => `${value}`,
      }}
      axisBottom={{
        legend: 'Status',
        legendPosition: 'middle',
        legendOffset: 32,
        tickSize: 5,
        spacing: 10,
        tickPadding: 5,
        tickRotation: 0,
      }}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: '#ffffff',
            },
          },
          ticks: {
            line: {
              stroke: '#ffffff',
            },
            text: {
              fill: '#ffffff',
            },
          },
          legend: {
            text: {
              fill: '#ffffff',
            },
          },
        },
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#ffffff"
      tooltip={CustomTooltip}  // Updated custom tooltip
      animate={true}
    />
  );
};

export default MyResponsiveBarChart;
