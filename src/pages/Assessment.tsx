import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Backpack, Clock, AlertCircle, MessageCircle } from "lucide-react";
const Assessment = () => {
  const {
    t
  } = useLanguage();
  useEffect(() => {
    document.title = `${t('assessment.prep.title')} - Signal Performance`;
  }, [t]);
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('assessment.prep.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('assessment.prep.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* What to Bring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  
                  {t('assessment.prep.whatToBring.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.whatToBring.golfClubs')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.whatToBring.athleticWear')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.whatToBring.shoes')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.whatToBring.waterBottle')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.whatToBring.towel')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.whatToBring.changeOfClothes')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.whatToBring.snacks')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Important Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  
                  {t('assessment.prep.reminders.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.reminders.avoidOvereating')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{t('assessment.prep.reminders.arriveEarly')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{t('assessment.prep.reminders.restAndHydrate')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* LINE Contact */}
          <div className="mt-12">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3">
                  
                  {t('assessment.prep.lineButton.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="bg-[#00B900] hover:bg-[#00A000] text-white font-medium px-8 py-3 h-auto" size="lg">
                  <a href="https://lin.ee/2mE17yG" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {t('assessment.prep.lineButton.text')}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              {t('assessment.prep.contactInfo')}
            </p>
          </div>
        </div>
      </main>
    </div>;
};
export default Assessment;