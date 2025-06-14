
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ContainerScroll,
  ContainerSticky,
  ProcessCard,
  ProcessCardBody,
  ProcessCardTitle 
} from "@/components/ui/process-timeline";

const GettingStarted = () => {
  const { t } = useLanguage();

  const PROCESS_PHASES = [
    {
      id: "process-1",
      title: t('gettingStarted.step1.title'),
      description: t('gettingStarted.step1.description'),
    },
    {
      id: "process-2",
      title: t('gettingStarted.step2.title'),
      description: t('gettingStarted.step2.description'),
    },
    {
      id: "process-3",
      title: t('gettingStarted.step3.title'),
      description: t('gettingStarted.step3.description'),
    },
    {
      id: "process-4",
      title: t('gettingStarted.step4.title'),
      description: t('gettingStarted.step4.description'),
    },
  ];

  return (
    <section id="getting-started" className="bg-signal-light-gray overflow-hidden">
        <div className="container mx-auto text-left container-padding pt-24 pb-12">
            <h2 className="text-4xl font-lora font-bold mb-8 text-signal-charcoal">{t('gettingStarted.title')}</h2>
        </div>
        <ContainerScroll className="h-[250vh]">
            <ContainerSticky className="top-24 flex flex-nowrap -ml-40">
                {PROCESS_PHASES.map((phase, index) => (
                <ProcessCard
                    key={phase.id}
                    itemsLength={PROCESS_PHASES.length}
                    index={index}
                    className="min-w-[70%] max-w-[70%] rounded-2xl"
                    variant="light"
                >
                    <ProcessCardTitle className="border-r border-gray-200">
                    <div className="rounded-full size-8 bg-signal-charcoal text-white text-sm flex justify-center items-center">
                        {String(index + 1).padStart(2, "0")}
                    </div>
                    </ProcessCardTitle>
                    <ProcessCardBody className="flex flex-col gap-4">
                    <h3 className="text-2xl font-semibold leading-tight text-signal-charcoal">
                        {phase.title}
                    </h3>
                    <p className="text-gray-700 max-w-md">{phase.description}</p>
                    </ProcessCardBody>
                </ProcessCard>
                ))}
            </ContainerSticky>
        </ContainerScroll>
    </section>
  );
};

export default GettingStarted;
