import { CreateProjectDialog } from '../project/create-project-dialog';

export function ModalProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <CreateProjectDialog />
            {children}
        </>
    );
}
