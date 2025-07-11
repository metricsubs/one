import { useAtom } from 'jotai';
import { LuPlus } from 'react-icons/lu';
import { DashboardPageTitle } from '~/components/dashboard/dashboard-page-title';
import { Button } from '~/components/ui';
import { createProjectDialogOpenAtom } from '~/core/store/project';
import { Stats } from './_partials/stats';

export default function ProjectsPage() {
    const [_open, setOpen] = useAtom(createProjectDialogOpenAtom);

    return (
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <DashboardPageTitle
                title="Projects"
                rightAccessories={
                    <Button
                        intent="primary"
                        size="md"
                        onClick={() => setOpen(true)}
                    >
                        <LuPlus className="w-4 h-4" />
                        Create Project
                    </Button>
                }
            />
            <Stats />
        </div>
    );
}
