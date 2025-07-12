import { CreateProjectDialog } from '../project/create-project-dialog';
import { Toast } from '../ui/toast';

export function ModalProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toast />
            <CreateProjectDialog />
            {children}
        </>
    );
}
