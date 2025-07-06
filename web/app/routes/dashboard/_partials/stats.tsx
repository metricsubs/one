import { useQuery } from 'convex/react';
import { api } from '~/../convex/_generated/api';
import { StatCard } from './stat-card';

export function Stats() {
    const data = useQuery(api.projects.stats.getStats, {});

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data?.stats.map((item) => (
                <StatCard key={item.name} item={item} />
            ))}
        </div>
    );
}
