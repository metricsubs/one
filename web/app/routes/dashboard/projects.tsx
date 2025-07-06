import { LuPlus } from 'react-icons/lu';
import { DashboardPageTitle } from '~/components/dashboard/dashboard-page-title';
import { Button } from '~/components/ui';
import { Stats } from './_partials/stats';

export default function ProjectsPage() {
    return (
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <DashboardPageTitle
                title="Projects"
                rightAccessories={
                    <Button intent="primary" size="md">
                        <LuPlus className="w-4 h-4" />
                        Create Project
                    </Button>
                }
            />
            <Stats />
        </div>
    );
}
