import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 ' +
    'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                default:     'bg-neutral-900 text-white hover:bg-neutral-700',
                destructive: 'bg-red-500 text-white hover:bg-red-600',
                outline:     'border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50',
                secondary:   'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
                ghost:       'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
                link:        'text-neutral-900 underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm:      'h-8 rounded-md px-3 text-xs',
                lg:      'h-10 rounded-md px-8',
                icon:    'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size:    'default',
        },
    }
);

export function Button( { className, variant, size, ...props } ) {
    return (
        <button
            className={ cn( buttonVariants( { variant, size } ), className ) }
            { ...props }
        />
    );
}

export { buttonVariants };
