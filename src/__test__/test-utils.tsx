// test-utils.tsx
import React, {ReactElement} from 'react';
import {render, RenderOptions} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from "./test-i18n-config.ts";

const AllTheProviders = ({children}: { children: React.ReactNode }) => {
    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options});

// re-export everything
export * from '@testing-library/react';
export {customRender as render};