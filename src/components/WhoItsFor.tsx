import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X } from 'lucide-react';

const WhoItsFor = () => {
  const { t } = useLanguage();
  const forItems = ['whoitsfor.for.item1', 'whoitsfor.for.item2', 'whoitsfor.for.item3', 'whoitsfor.for.item4'];
  const notForItems = ['whoitsfor.notfor.item1', 'whoitsfor.notfor.item2', 'whoitsfor.notfor.item3', 'whoitsfor.notfor.item4'];

  return (
    <section aria-labelledby="who-its-for-heading" className="w-full">
      <div className="container mx-auto px-4 py-12">
        <h2 id="who-its-for-heading" className="text-3xl font-semibold tracking-tight text-foreground mb-8">
          {t('whoitsfor.title') ?? "Who it's for"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium text-foreground mb-4">{t('whoitsfor.for.title') ?? 'This is for'}</h3>
              <ul className="space-y-3">
                {forItems.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                    <span className="text-muted-foreground">{t(key)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium text-foreground mb-4">{t('whoitsfor.notfor.title') ?? 'This is not for'}</h3>
              <ul className="space-y-3">
                {notForItems.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden />
                    <span className="text-muted-foreground">{t(key)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;
