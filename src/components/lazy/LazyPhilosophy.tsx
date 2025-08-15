import { lazy } from 'react';

const LazyPhilosophy = lazy(() => import('../memo/MemoizedPhilosophy'));

export default LazyPhilosophy;