import { useEffect, useState } from "react";
import { Bell, Check, Copy, ExternalLink, Flame, Loader2, Send, Users, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { requestFirebaseToken } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export const HOST_RECIPIENTS = [
  {
    phone: "+91 75590 07094",
    topic: "ashik-thasleema-rsvp-7559007094",
    url: "https://ntfy.sh/ashik-thasleema-rsvp-7559007094",
  },
  {
    phone: "+91 96335 96679",
    topic: "ashik-thasleema-rsvp-9633596679",
    url: "https://ntfy.sh/ashik-thasleema-rsvp-9633596679",
  },
];

export async function sendRsvpPushNotification({
  name,
  guests,
  attending,
  message,
}: {
  name: string;
  guests: number;
  attending: "yes" | "no";
  message?: string;
}) {
  const attendingText = attending === "yes" ? "Joyfully Accepting ✅" : "Unable to Attend ❌";
  const tags = attending === "yes" ? "tada,sparkles,ring" : "envelope,wave";
  const cleanName = name.replace(/[^\x20-\x7E]/g, "").trim() || "Guest";

  try {
    // Broadcast notification to both host topics simultaneously
    await Promise.all(
      HOST_RECIPIENTS.map((host) =>
        fetch(`https://ntfy.sh/${host.topic}`, {
          method: "POST",
          headers: {
            Title: `Wedding RSVP: ${cleanName} (${guests} ${guests > 1 ? "Guests" : "Guest"})`,
            Priority: "high",
            Tags: tags,
          },
          body: `${name} has responded: ${attendingText}\nGuests: ${guests}${message ? `\n\n"${message}"` : ""}`,
        })
      )
    );
  } catch (err) {
    console.warn("Failed to dispatch push notification:", err);
  }
}

export function HostNotificationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loadingRsvps, setLoadingRsvps] = useState(false);

  // Firebase states
  const [fcmLoading, setFcmLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [fcmError, setFcmError] = useState<string | null>(null);
  const [fcmCopied, setFcmCopied] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadRsvps = async () => {
      if (!supabase) return;
      setLoadingRsvps(true);
      try {
        const { data, error } = await supabase
          .from("rsvps")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        if (!error && data) {
          setRsvps(data);
        }
      } catch (e) {
        console.warn("Error fetching recent RSVPs:", e);
      } finally {
        setLoadingRsvps(false);
      }
    };

    loadRsvps();
  }, [open]);

  const handleEnableFirebase = async () => {
    setFcmLoading(true);
    setFcmError(null);
    const res = await requestFirebaseToken();
    setFcmLoading(false);
    if (res.success && res.token) {
      setFcmToken(res.token);
    } else {
      setFcmError(res.error || "Could not register Firebase token");
    }
  };

  const handleCopyFcmToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      setFcmCopied(true);
      setTimeout(() => setFcmCopied(false), 3000);
    }
  };

  const handleSendTest = async () => {
    setTesting(true);
    setTestSuccess(false);

    try {
      await Promise.all(
        HOST_RECIPIENTS.map((host) =>
          fetch(`https://ntfy.sh/${host.topic}`, {
            method: "POST",
            headers: {
              Title: "Wedding RSVP Test Notification",
              Priority: "high",
              Tags: "ring,bell",
            },
            body: `Test notification sent to ${host.phone}! Push alerts are functioning properly.`,
          })
        )
      );
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 5000);
    } catch (err) {
      console.error("Test notification failed:", err);
    } finally {
      setTesting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-background border border-primary/30 p-6 shadow-2xl text-foreground max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full transition-colors"
          aria-label="Close notification settings"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-foreground">Host Push Notifications</h2>
            <p className="text-xs text-muted-foreground">
              Configured for +91 75590 07094 & +91 96335 96679
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* Firebase Cloud Messaging Section */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Flame className="h-4 w-4 fill-primary text-primary" /> Firebase Cloud Messaging
              </p>
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                VAPID Connected
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Register this browser/phone with your Firebase project (<code>wedding-notifcation</code>) to receive direct Google push notifications.
            </p>

            {!fcmToken ? (
              <Button
                type="button"
                onClick={handleEnableFirebase}
                disabled={fcmLoading}
                className="gold-button w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold shadow"
              >
                {fcmLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                Register Device with Firebase
              </Button>
            ) : (
              <div className="space-y-2 p-3 rounded-lg bg-background border border-primary/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Device Registered with Firebase!
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyFcmToken}
                    className="h-7 text-xs flex items-center gap-1 text-primary hover:text-primary"
                  >
                    {fcmCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {fcmCopied ? "Copied" : "Copy Token"}
                  </Button>
                </div>
                <div className="p-2 rounded bg-muted/60 text-[10px] font-mono break-all text-muted-foreground max-h-16 overflow-y-auto">
                  {fcmToken}
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  💡 In Firebase Console → <strong>Messaging</strong> → <strong>New Campaign</strong> → <strong>Send test message</strong>, paste this token to send an instant test push to this device!
                </p>
              </div>
            )}

            {fcmError && (
              <p className="text-xs text-destructive font-medium mt-1">
                ⚠️ {fcmError}
              </p>
            )}
          </div>

          {/* Quick Pub/Sub Notification Section */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border/70 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Automated Alerts for Both Numbers
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every RSVP is also pushed in real-time to both phone topics:
            </p>

            <div className="space-y-2">
              {HOST_RECIPIENTS.map((host) => (
                <div
                  key={host.phone}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-background/60"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground">{host.phone}</p>
                    <p className="text-[10px] text-muted-foreground">Topic: {host.topic}</p>
                  </div>
                  <a
                    href={host.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gold-button inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-[11px] font-semibold shadow no-underline"
                  >
                    <ExternalLink className="h-3 w-3" /> View Alerts
                  </a>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSendTest}
                disabled={testing}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs"
              >
                {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {testSuccess ? "Ping Sent to Both Phones!" : "Send Test Ping to Both Numbers"}
              </Button>
            </div>

            {testSuccess && (
              <p className="text-xs text-primary font-medium flex items-center gap-1.5 mt-2">
                <Check className="h-3.5 w-3.5" /> Test sent to both numbers!
              </p>
            )}
          </div>

          {/* Recent RSVPs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Recent RSVP Submissions
              </h3>
              {loadingRsvps && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </div>

            {rsvps.length === 0 && !loadingRsvps && (
              <p className="text-xs text-muted-foreground italic p-3 rounded-lg bg-muted/30 text-center">
                No RSVPs found yet or unable to fetch from database.
              </p>
            )}

            {rsvps.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {rsvps.map((rsvp, idx) => (
                  <div
                    key={rsvp.id || idx}
                    className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-medium text-foreground">{rsvp.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {rsvp.guests} {rsvp.guests > 1 ? "guests" : "guest"}
                        {rsvp.message ? ` • "${rsvp.message}"` : ""}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        rsvp.attending === "yes"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {rsvp.attending === "yes" ? "Attending" : "Declined"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border/50 text-right">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
