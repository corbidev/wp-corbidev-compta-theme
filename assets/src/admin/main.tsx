import { createRoot } from 'react-dom/client';
import { ImportModal } from '@/components/ImportModal';
import '@admin/styles/admin.css';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('corbidev-compta-modal-root');

    if (!rootElement) {
        return;
    }

    const reactRoot = createRoot(rootElement);
    const importButton = document.getElementById('corbidev-compta-import-btn');

    const renderModal = (isOpen: boolean) => {
        reactRoot.render(
            <ImportModal
                isOpen={isOpen}
                onClose={() => renderModal(false)}
                data={window.cdComptaData ?? {}}
            />,
        );
    };

    renderModal(false);

    if (importButton) {
        importButton.addEventListener('click', () => renderModal(true));
    }
});