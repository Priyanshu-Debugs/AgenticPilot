"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

interface AutomationTask {
  id: string;
  name: string;
  description: string;
  href: string;
  actionLabel?: string;
}

interface AutomationControllerProps {
  tasks: AutomationTask[];
}
export function AutomationController({ tasks }: AutomationControllerProps) {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Automation Controller</h2>
            <p className="text-sm text-muted-foreground">
              Jump directly into each agent workspace
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="flex items-center gap-x-2 bg-muted/50"
        >
          <Zap className="size-3" />
          <span>{tasks.length} Agents</span>
        </Badge>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden card-elevated">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                </div>
                <Button asChild size="sm" className="gap-2">
                  <Link href={task.href}>
                    {task.actionLabel || task.name}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Open the agent workspace to configure and run this automation.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="text-center py-8">
            <Zap className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Automations Found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first automation task.
            </p>
            <Button>Create Automation</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
