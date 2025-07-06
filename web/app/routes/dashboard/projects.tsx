import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import { LuPlus } from 'react-icons/lu';
import { DashboardPageTitle } from '~/components/dashboard/dashboard-page-title';
import { Button } from '~/components/ui';
import { Stats } from './_partials/stats';

export default function ProjectsPage() {
    const getPresignedUploadUrl = useAction(
        api.large_files.getPresignedUploadUrl
    );

    const handleGeneratePresignedUploadUrl = () => {
        getPresignedUploadUrl({
            key: 'test.txt',
            contentType: 'text/plain',
            contentLength: 100,
        })
            .then((url) => {
                console.log(url);
            })
            .catch((error) => {
                console.error(error);
            });
    };

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
            <Button
                intent="primary"
                size="md"
                className="w-full"
                onClick={handleGeneratePresignedUploadUrl}
            >
                Generate Presigned Upload URL
            </Button>
        </div>
    );
}
