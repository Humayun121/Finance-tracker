/** Copy and illustrative sample figures for the public landing page. */

export const PROOF = [
  { value: 'Any pay period', label: '17 Aug – 20 Sep is a normal case, not a workaround' },
  { value: 'Your categories', label: 'Named by you, not chosen from a fixed list' },
  { value: 'Gross pay, estimated', label: 'Paid hours and rate worked out for you' },
];

export const WHAT_IT_DOES = [
  'Log expenses in a few seconds',
  'Group spending by your own categories',
  'Record shifts and estimate gross pay',
  'See any pay period, not just calendar months',
];

export const STEPS = [
  {
    number: '01',
    title: 'Log an expense',
    body: 'Amount, date, category and a short description. Everything lands in one list you can filter by any date range.',
    metric: 'Fields per expense',
    value: '4',
    pct: '80%',
  },
  {
    number: '02',
    title: 'Group it your way',
    body: 'Make your own categories and see the breakdown across them, rather than fitting into someone else’s labels.',
    metric: 'Category list',
    value: 'Yours',
    pct: '60%',
  },
  {
    number: '03',
    title: 'Add your shifts',
    body: 'Start, end, break and hourly rate. Paid hours and estimated gross pay are worked out for the period you choose.',
    metric: 'Inputs per shift',
    value: '4',
    pct: '80%',
  },
];

export const AUDIENCES = [
  { initial: 'H', title: 'Hourly and shift workers', body: 'Log shifts as you work them and see estimated gross pay build up across your actual pay period.' },
  { initial: 'S', title: 'Students', body: 'Part-time hours alongside term-time spending, without a spreadsheet to maintain.' },
  { initial: 'F', title: 'Freelancers', body: 'Keep expenses grouped by your own categories, and track what a run of work is worth.' },
];

export const INSTALL_STEPS = [
  'Open Finance Tracker in your phone browser',
  'Tap Share, then “Add to Home Screen”',
  'Open it from your home screen, full screen every time',
];

export const FAQS = [
  { q: 'Is Finance Tracker free?', a: 'Yes. It is a personal project with no paid tier, no adverts and nothing to upgrade.' },
  { q: 'Does it connect to my bank?', a: 'No. There is no bank connection and no open banking. You enter expenses yourself. That keeps your account details out of it entirely.' },
  { q: 'What can I track?', a: 'Expenses with an amount, date, category and description; your own categories; and work shifts with start time, end time, break and hourly rate.' },
  { q: 'How does the shift pay estimate work?', a: 'Paid hours are the time between start and end, minus your break. Multiplied by your hourly rate, that gives estimated gross pay, before tax and any other deductions.' },
  { q: 'Can it handle a pay period that is not a calendar month?', a: 'Yes, that is the point of it. Set any start and end date, 17 August to 20 September for example, and the totals cover exactly that range.' },
  { q: 'Is there budgeting?', a: 'Not yet. Budgets are planned, so for now the app shows what you have actually spent rather than what you planned to.' },
];

/* Illustrative sample figures used only inside the product mock-ups. */

export const MOCK_BARS = [
  { name: 'Groceries', amount: '£318.40', pct: '100%', color: 'var(--cat-1)' },
  { name: 'Rent & bills', amount: '£295.00', pct: '93%', color: 'var(--cat-2)' },
  { name: 'Dining out', amount: '£164.75', pct: '52%', color: 'var(--cat-3)' },
];

export const MOCK_TILES = [
  { label: 'Spent this month', value: '£981.85', meta: '+£91.85 vs last month' },
  { label: 'Spent this week', value: '£148.90', meta: '£21.27 daily average' },
  { label: 'Est. shift income', value: '£1,284', meta: '11 shifts · 92.25 hrs' },
];

export const MOCK_RECENT = [
  { description: 'Tesco Metro', meta: 'Groceries · 17 Sep', amount: '£42.18', color: 'var(--cat-1)' },
  { description: 'Monthly travelcard', meta: 'Transport · 16 Sep', amount: '£98.20', color: 'var(--cat-3)' },
  { description: 'Dinner, Rosso', meta: 'Dining out · 15 Sep', amount: '£36.50', color: 'var(--cat-2)' },
  { description: 'Broadband', meta: 'Rent & bills · 14 Sep', amount: '£31.00', color: 'var(--cat-5)' },
];

export const MOCK_SHIFT_TOTALS = [
  { label: 'Estimated gross pay', value: '£1,284.38', meta: 'before tax' },
  { label: 'Total paid hours', value: '92.25', meta: 'breaks excluded' },
  { label: 'Shifts', value: '11', meta: 'in this period' },
];

export const MOCK_SHIFT_ROWS = [
  { date: '2 Sep', time: '10:00 – 18:15', hours: '7.75', pay: '£110.44' },
  { date: '9 Sep', time: '07:30 – 15:30', hours: '8.00', pay: '£114.00' },
  { date: '14 Sep', time: '13:00 – 21:00', hours: '7.00', pay: '£99.75' },
  { date: '16 Sep', time: '09:00 – 17:00', hours: '7.50', pay: '£106.88' },
];

export const MOCK_HOUR_BARS = [
  { week: '17 Aug', value: '16.5', pct: '52%' },
  { week: '24 Aug', value: '23.0', pct: '72%' },
  { week: '31 Aug', value: '15.75', pct: '49%' },
  { week: '7 Sep', value: '22.5', pct: '70%' },
  { week: '14 Sep', value: '14.5', pct: '45%' },
];

export const MOCK_PHONE_TILES = [
  { value: '£981.85', label: 'This month' },
  { value: '£148.90', label: 'This week' },
  { value: '£1,284', label: 'Shift pay' },
  { value: '92.25', label: 'Paid hours' },
];

export const MOCK_NAV = ['Dashboard', 'Expenses', 'Categories', 'Shifts'];
