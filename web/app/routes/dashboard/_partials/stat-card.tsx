import { IconChartTrending, IconChartTrendingDown } from '@intentui/icons';
import {
    Badge,
    Card,
    ChartTooltipContent,
    SparkAreaChart,
} from '~/components/ui';
import { cn } from '~/lib/cn';

interface StatCardProps {
    item: {
        name: string;
        value: number;
        change: number;
        data: { date: string; value: number }[];
    };
}

export function StatCard({ item }: StatCardProps) {
    return (
        <Card className="pb-0 flex flex-col justify-between" key={item.name}>
            <Card.Header>
                <Card.Description>{item.name}</Card.Description>
                <Card.Title>{item.value}</Card.Title>
                <Card.Action>
                    <Badge intent={item.change > 0 ? 'primary' : 'danger'}>
                        {item.change > 0 ? (
                            <IconChartTrending />
                        ) : (
                            <IconChartTrendingDown />
                        )}
                        {item.change}%
                    </Badge>
                </Card.Action>
            </Card.Header>
            <SparkAreaChart
                lineType="bump"
                config={{
                    value: {
                        label: item.name,
                        color:
                            item.change < 0
                                ? 'var(--danger)'
                                : 'var(--chart-1)',
                    },
                }}
                data={item.data}
                dataKey={'value'}
                fillType="gradient"
                tooltip={(data) => {
                    return (
                        <ChartTooltipContent
                            className="bg-bg/65 dark:bg-bg/50 backdrop-blur-sm min-w-0"
                            accessibilityLayer
                            payload={data.payload}
                            labelSeparator={false}
                            hideLabel
                            formatter={(value, name, item) => {
                                const date = item.payload.date;
                                const indicatorColor = item.color || item.fill;
                                return (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={cn(
                                                    'shrink-0 rounded-full border-(--color-border) bg-(--color-bg)',
                                                    'size-2.5'
                                                )}
                                                style={
                                                    {
                                                        '--color-bg':
                                                            indicatorColor,
                                                        '--color-border':
                                                            indicatorColor,
                                                    } as React.CSSProperties
                                                }
                                            />
                                            {date}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-fg">
                                            {value}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    );
                }}
                className="h-12 w-full"
            />
        </Card>
    );
}
