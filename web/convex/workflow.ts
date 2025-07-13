import { WorkflowManager } from '@convex-dev/workflow';
import { components } from 'convex/_generated/api';

export const workflow = new WorkflowManager(components.workflow, {
    workpoolOptions: {
        // You must only set this to one value per components.xyz!
        // You can set different values if you "use" multiple different components
        // in convex.config.ts.
        maxParallelism: 10,
    },
});
