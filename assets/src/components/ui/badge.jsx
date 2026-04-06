import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default:     'border-transparent bg-neutral-900 text-white',
                secondary:   'border-transparent bg-neutral-100 text-neutral-700',
                destructive: 'border-transparent bg-red-100 text-red-700',
                success:     'border-transparent bg-green-100 text-green-700',
                outline:     'border-neutral-200 text-neutral-700',
            },
        },
        defaultVariants: { variant: 'default' },
    }
);

export function Badge( { className, variant, ...props } ) {
    return <span className={ cn( badgeVariants( { variant } ), className ) } { ...props } />;
}

export { badgeVariants };
