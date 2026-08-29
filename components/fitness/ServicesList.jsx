"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ServiceBlock from "@/components/fitness/ServiceBlock";

// The alternating (image left/right) service blocks — data comes from the
// admin-managed Service model, not a static config file.
export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services")
      .then((res) => (res.ok ? res.json() : { services: [] }))
      .then((body) => {
        if (!cancelled) setServices(body.services ?? []);
      })
      .catch(() => {
        if (!cancelled) setServices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading services...
      </div>
    );
  }

  return (
    <div>
      {services.map((service, i) => (
        <ServiceBlock key={service.id} service={service} reverse={i % 2 === 1} />
      ))}
    </div>
  );
}
