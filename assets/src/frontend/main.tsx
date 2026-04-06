import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/frontend.css';

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('corbidev-compta-app');

    if (!rootElement) {
        return;
    }

    createRoot(rootElement).render(<App />);
});