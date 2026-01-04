"use client";

import { ControlCenter } from "./control-center";
import { Card, CardContent, CardHeader, CardTitle } from "@orangec-at/design";

export function ControlCenterDemo() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Control Center Redesign</h1>
        <p className="text-muted-foreground">
          Modern web UI component with conventional design patterns
        </p>
      </div>

      {/* Inline Control Center Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Inline Control Panel</span>
            <span className="text-sm font-normal text-muted-foreground">
              Web-optimized design
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ControlCenter
            variant="inline"
            className="bg-muted/30 rounded-lg p-4"
            onAction={(action, data) => {
              console.log("Control action:", action, data);
            }}
          />
        </CardContent>
      </Card>

      {/* Design System Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Design Improvements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                ✨ Enhanced Hover Effects
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Scale transforms instead of background highlights</li>
                <li>• Subtle brightness adjustments for feedback</li>
                <li>• Smooth easing with 200ms duration</li>
                <li>• Active states with scale-down effect</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                🎯 Better Icon Choice
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sliders icon instead of Settings gear</li>
                <li>• More appropriate for control panel context</li>
                <li>• Consistent with grayscale design system</li>
                <li>• Better semantic meaning for web UI</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                🌐 Web-Native Layout
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Inline component instead of popup overlay</li>
                <li>• Flexible grid system (8 columns vs 6)</li>
                <li>• No backdrop blur or modal behavior</li>
                <li>• Responsive and embeddable anywhere</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                🎨 Professional Styling
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reduced mobile-inspired aesthetics</li>
                <li>• Conventional web UI patterns</li>
                <li>• Maintains grayscale color scheme</li>
                <li>• Clean, minimal professional look</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
