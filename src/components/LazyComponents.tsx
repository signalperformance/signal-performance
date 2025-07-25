import { lazy, Suspense } from 'react';
import { SkeletonLoader, SkeletonCard } from './SkeletonLoader';

// Lazy load heavy components
export const LazyAssessmentProcess = lazy(() => import('./AssessmentProcess'));
export const LazyWeeklySchedule = lazy(() => import('./WeeklySchedule'));
export const LazyWaveAnimation = lazy(() => import('./WaveAnimation'));
export const LazyMembership = lazy(() => import('./Membership'));
export const LazyWhoItsFor = lazy(() => import('./WhoItsFor'));
export const LazyStudioLocation = lazy(() => import('./StudioLocation'));

// Suspense wrappers with appropriate loading states
export const AssessmentProcessWithSuspense = () => (
  <Suspense fallback={
    <section className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <SkeletonLoader variant="text" className="w-1/3 mx-auto mb-8 h-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </section>
  }>
    <LazyAssessmentProcess />
  </Suspense>
);

export const WeeklyScheduleWithSuspense = () => (
  <Suspense fallback={
    <section className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <SkeletonLoader variant="text" className="w-1/3 mx-auto mb-8 h-8" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} variant="card" className="h-20" />
          ))}
        </div>
      </div>
    </section>
  }>
    <LazyWeeklySchedule />
  </Suspense>
);

export const MembershipWithSuspense = () => (
  <Suspense fallback={
    <section className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <SkeletonLoader variant="text" className="w-1/3 mx-auto mb-8 h-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  }>
    <LazyMembership />
  </Suspense>
);

export const WhoItsForWithSuspense = () => (
  <Suspense fallback={
    <section className="section-padding container-padding">
      <div className="max-w-4xl mx-auto">
        <SkeletonLoader variant="text" className="w-1/3 mx-auto mb-8 h-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </section>
  }>
    <LazyWhoItsFor />
  </Suspense>
);

export const StudioLocationWithSuspense = () => (
  <Suspense fallback={
    <section className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <SkeletonLoader variant="text" className="w-1/3 mx-auto mb-8 h-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <SkeletonLoader variant="image" />
          <SkeletonCard />
        </div>
      </div>
    </section>
  }>
    <LazyStudioLocation />
  </Suspense>
);