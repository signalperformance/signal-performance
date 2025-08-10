import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X } from 'lucide-react';
const WhoItsFor = () => {
  const {
    t
  } = useLanguage();
  const forItems = ['whoitsfor.for.item1', 'whoitsfor.for.item2', 'whoitsfor.for.item3', 'whoitsfor.for.item4'];
  const notForItems = ['whoitsfor.notfor.item1', 'whoitsfor.notfor.item2', 'whoitsfor.notfor.item3', 'whoitsfor.notfor.item4'];
  return;
};
export default WhoItsFor;