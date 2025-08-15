import { lazy } from 'react';

const LazyWeeklySchedule = lazy(() => import('../memo/MemoizedWeeklySchedule'));

export default LazyWeeklySchedule;