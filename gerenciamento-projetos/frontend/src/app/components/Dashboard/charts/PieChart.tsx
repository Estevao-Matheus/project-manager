import { ResponsivePie } from '@nivo/pie';
import { PieTooltipProps } from '@nivo/pie';

interface PieChartData {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface MyResponsivePieProps {
  data: PieChartData[];
}

const MyResponsivePie: React.FC<MyResponsivePieProps> = ({ data }) => {
  const CustomTooltip = ({ datum }: PieTooltipProps) => (
    
    <div
      style={{
        padding: '6px 12px',
        background: 'black', 
        color: 'white', 
        borderRadius: '4px',
         display: 'flex',
        alignItems: 'center',
      }}
    ><div
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: datum.color,
          marginRight: '8px',
        }}
      />
      <strong>{datum.id}</strong>: {datum.value}
    </div>
  );

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#ffffff"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: '#ffffff',
        modifiers: [['darker', 2]],
      }}
      tooltip={CustomTooltip}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#ffffff',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#ffffff',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 12, 
          itemWidth: 120, 
          itemHeight: 18,
          itemTextColor: '#ffffff',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: 'green',
              },
            },
          ],
        },
      ]}
    />
  );
};

export default MyResponsivePie;
