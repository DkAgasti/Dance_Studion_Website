import ServiceBlock from "@/components/fitness/ServiceBlock";
import { fitnessClasses } from "@/config/classes";

// The four alternating (image left/right) service blocks.
export default function ServicesList() {
  return (
    <div>
      {fitnessClasses.map((service, i) => (
        <ServiceBlock key={service.slug} service={service} reverse={i % 2 === 1} />
      ))}
    </div>
  );
}
