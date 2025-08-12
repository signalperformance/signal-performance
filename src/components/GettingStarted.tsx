import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react';
const GettingStarted = () => {
  const {
    t
  } = useLanguage();
  const steps = [{
    title: t('gettingstarted.step1.title'),
    subtitle: t('gettingstarted.step1.subtitle'),
    hours: t('gettingstarted.step1.hours')
  }, {
    title: t('gettingstarted.step2.title'),
    subtitle: t('gettingstarted.step2.subtitle'),
    hours: t('gettingstarted.step2.hours')
  }, {
    title: t('gettingstarted.step3.title'),
    subtitle: t('gettingstarted.step3.subtitle'),
    hours: t('gettingstarted.step3.hours')
  }, {
    title: t('gettingstarted.step4.title'),
    subtitle: t('gettingstarted.step4.subtitle'),
    hours: t('gettingstarted.step4.hours')
  }];
  return;
};
export default GettingStarted;