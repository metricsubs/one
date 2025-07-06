import { query } from '../_generated/server';

const stats = [
    {
        name: 'Open Projects',
        value: 3,
        change: 5.6,
        isMoreBetter: false,
        data: [
            { value: 2, date: 'Jan 08' },
            { value: 4, date: 'Jan 09' },
            { value: 1, date: 'Jan 10' },
            { value: 0, date: 'Jan 11' },
            { value: 2, date: 'Jan 12' },
            { value: 1, date: 'Jan 13' },
            { value: 0, date: 'Jan 14' },
            { value: 1, date: 'Jan 15' },
            { value: 0, date: 'Jan 16' },
            { value: 1, date: 'Jan 17' },
            { value: 0, date: 'Jan 18' },
            { value: 2, date: 'Jan 19' },
        ],
    },
    {
        name: 'Work in Progress',
        value: 3,
        change: 5.6,
        isMoreBetter: true,
        data: [
            { value: 2, date: 'Jan 08' },
            { value: 4, date: 'Jan 09' },
            { value: 1, date: 'Jan 10' },
            { value: 0, date: 'Jan 11' },
            { value: 2, date: 'Jan 12' },
            { value: 1, date: 'Jan 13' },
            { value: 0, date: 'Jan 14' },
            { value: 1, date: 'Jan 15' },
            { value: 0, date: 'Jan 16' },
            { value: 1, date: 'Jan 17' },
            { value: 0, date: 'Jan 18' },
            { value: 2, date: 'Jan 19' },
        ],
    },
    {
        name: 'Active Contributors',
        value: '3 / 35',
        change: 12,
        data: [
            { value: 31240, date: 'Jan 08' },
            { value: 42110, date: 'Jan 09' },
            { value: 23520, date: 'Jan 10' },
            { value: 64130, date: 'Jan 11' },
            { value: 74840, date: 'Jan 12' },
            { value: 15233, date: 'Jan 13' },
            { value: 36000, date: 'Jan 14' },
            { value: 87000, date: 'Jan 15' },
            { value: 37500, date: 'Jan 16' },
            { value: 78200, date: 'Jan 17' },
            { value: 89100, date: 'Jan 18' },
            { value: 90000, date: 'Jan 19' },
        ],
    },
    {
        name: 'Finished Projects',
        value: 78,
        change: +3.2,
        data: [
            { value: 6, date: 'Jan 08' },
            { value: 8, date: 'Jan 09' },
            { value: 10, date: 'Jan 10' },
            { value: 14, date: 'Jan 11' },
            { value: 19, date: 'Jan 12' },
            { value: 20, date: 'Jan 13' },
            { value: 21, date: 'Jan 14' },
            { value: 26, date: 'Jan 15' },
            { value: 26, date: 'Jan 16' },
            { value: 28, date: 'Jan 17' },
            { value: 29, date: 'Jan 18' },
            { value: 30, date: 'Jan 19' },
        ],
    },
];

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        return {
            stats,
        };
    },
});
