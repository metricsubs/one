import axios from 'axios';
import { api } from 'convex/_generated/api';
import { useAction } from 'convex/react';
import { useState } from 'react';
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
    const getObjectMetadata = useAction(api.large_files.getObjectMetadata);

    const [file, setFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        } else {
            setFile(null);
        }
    };

    const handleUploadInSinglePart = async () => {
        if (!file) return;
        try {
            setUploadMessage('Getting presigned upload url...');
            const { url, fullFileKey, contentType, contentLength } =
                await getPresignedUploadUrl({
                    filename: file.name,
                    contentType: file.type,
                    contentLength: file.size,
                });
            setUploadMessage('Uploading file...');
            await axios.put(url, file, {
                headers: {
                    'Content-Type': contentType,
                    'Content-Length': contentLength.toString(),
                },
                onUploadProgress: (evt) => {
                    if (evt.total) {
                        const pct = Math.round((evt.loaded / evt.total) * 100);
                        setUploadMessage(`Uploading file... ${pct}%`);
                    }
                },
            });
            const metadata = await getObjectMetadata({
                fullFileKey,
            });
            console.log(metadata);
            setUploadMessage('Uploaded file');
        } catch (error) {
            setUploadMessage('Error: ' + error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <LogoIcon className="w-16 h-16 mb-4" />
            <h1 className="text-4xl font-semibold logo-font">MetricSubs</h1>
            <Button>Click me</Button>
            <input type="file" onChange={handleFileChange} />

            <Button
                intent="primary"
                size="md"
                className="w-full"
                onClick={handleUploadInSinglePart}
            >
                Upload in single part
            </Button>
            {uploadMessage && <p>{uploadMessage}</p>}
        </div>
    );
}
