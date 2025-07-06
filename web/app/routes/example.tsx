import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import LogoIcon from '~/components/common/logo-icon';
import { Button } from '~/components/ui/button';
import type { Route } from './+types/example';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'MetricSubs - Tech Without Boundaries' },
        {
            name: 'description',
            content:
                'MetricSubs is a volunteer-powered localization studio committed to turning the world’s best tech videos into native-quality Mandarin content.',
        },
    ];
}

export default function Example() {
    const getPresignedUploadUrl = useAction(
        api.large_files.getPresignedPutObjectUrl
    );

    const handleGeneratePresignedUploadUrl = () => {
        getPresignedUploadUrl({
            filename: 'test.txt',
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
        <div className="flex flex-col items-center justify-center h-screen">
            <LogoIcon className="w-16 h-16 mb-4" />
            <h1 className="text-4xl font-semibold logo-font">MetricSubs</h1>
            <Button>Click me</Button>

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
