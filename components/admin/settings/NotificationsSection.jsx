"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const EVENTS = [
  { key: "newAdmissions", label: "New Admissions", description: "When a student submits an enrollment form." },
  { key: "newTrials", label: "New Trial Bookings", description: "When someone books a free trial class." },
];

const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp" },
];

// "Notifications" settings section — admin alert toggles per event/channel.
export default function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    newAdmissions: { email: true, whatsapp: true },
    newTrials: { email: true, whatsapp: false },
  });

  function toggle(eventKey, channelKey) {
    setPrefs((p) => ({
      ...p,
      [eventKey]: { ...p[eventKey], [channelKey]: !p[eventKey][channelKey] },
    }));
  }

  return (
    <div className="glass-tile rounded-2xl p-6 sm:p-8">
      <h2 className="h4-display">Notifications</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Choose how the admin team gets alerted about new activity.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {EVENTS.map((event) => (
          <div key={event.key} className="rounded-xl bg-white/[0.02] p-4">
            <p className="font-medium">{event.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-8">
              {CHANNELS.map((channel) => (
                <label
                  key={channel.key}
                  htmlFor={`${event.key}-${channel.key}`}
                  className="flex items-center gap-3"
                >
                  <Switch
                    id={`${event.key}-${channel.key}`}
                    checked={prefs[event.key][channel.key]}
                    onCheckedChange={() => toggle(event.key, channel.key)}
                  />
                  <span className="text-sm text-muted-foreground">{channel.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
