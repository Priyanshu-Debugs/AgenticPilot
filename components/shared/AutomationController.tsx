"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Pause, Square, Settings, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react"

interface AutomationTask {
  id: string
  name: string
  description: string
  status: "running" | "paused" | "stopped" | "error" | "completed"
  progress: number
  lastRun?: string
  nextRun?: string
  executionTime?: string
  tasksProcessed?: number
  successRate?: number
}

interface AutomationControllerProps {
  tasks: AutomationTask[]
  onStartTask: (taskId: string) => void
  onPauseTask: (taskId: string) => void
  onStopTask: (taskId: string) => void
  onConfigureTask: (taskId: string) => void
}

const statusConfig = {
  running: {
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    badge: "Running",
    icon: Play
  },
  paused: {
    color: "bg-amber-500",
    textColor: "text-amber-600",
    badge: "Paused",
    icon: Pause
  },
  stopped: {
    color: "bg-muted-foreground",
    textColor: "text-muted-foreground",
    badge: "Stopped",
    icon: Square
  },
  error: {
    color: "bg-destructive",
    textColor: "text-destructive",
    badge: "Error",
    icon: AlertTriangle
  },
  completed: {
    color: "bg-primary",
    textColor: "text-primary",
    badge: "Completed",
    icon: CheckCircle
  }
}

export function AutomationController({ tasks, onStartTask, onPauseTask, onStopTask, onConfigureTask }: AutomationControllerProps) {
  const [selectedTask, setSelectedTask] = useState<AutomationTask | null>(null)

  const getProgressVariant = (status: AutomationTask["status"]) => {
    switch (status) {
      case "completed": return "success"
      case "error": return "destructive"
      case "paused": return "warning"
      default: return "default"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Automation Controller</h2>
        <Badge variant="outline" className="flex items-center space-x-2">
          <Zap className="h-3 w-3" />
          <span>{tasks.filter(t => t.status === "running").length} Active</span>
        </Badge>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => {
          const config = statusConfig[task.status]
          const StatusIcon = config.icon

          return (
            <Card key={task.id} className="overflow-hidden card-elevated">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`} />
                    <div>
                      <CardTitle className="text-lg">{task.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={config.textColor}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.badge}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTask(task)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Task Details: {task.name}</DialogTitle>
                          <DialogDescription>
                            View detailed information and metrics for this automation task.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Status</label>
                              <p className={`text-sm ${config.textColor}`}>{config.badge}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Progress</label>
                              <p className="text-sm">{task.progress}%</p>
                            </div>
                            {task.lastRun && (
                              <div>
                                <label className="text-sm font-medium">Last Run</label>
                                <p className="text-sm text-muted-foreground">{task.lastRun}</p>
                              </div>
                            )}
                            {task.nextRun && (
                              <div>
                                <label className="text-sm font-medium">Next Run</label>
                                <p className="text-sm text-muted-foreground">{task.nextRun}</p>
                              </div>
                            )}
                            {task.executionTime && (
                              <div>
                                <label className="text-sm font-medium">Execution Time</label>
                                <p className="text-sm text-muted-foreground">{task.executionTime}</p>
                              </div>
                            )}
                            {task.tasksProcessed && (
                              <div>
                                <label className="text-sm font-medium">Tasks Processed</label>
                                <p className="text-sm text-muted-foreground">{task.tasksProcessed.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                          {task.successRate && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">Success Rate</label>
                              <Progress value={task.successRate} variant="success" />
                              <p className="text-sm text-muted-foreground mt-1">{task.successRate}%</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress 
                    value={task.progress} 
                    variant={getProgressVariant(task.status)}
                  />
                </div>

                {task.status === "error" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This automation encountered an error. Check the logs for details.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {task.lastRun && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Last run: {task.lastRun}</span>
                      </div>
                    )}
                    {task.tasksProcessed && (
                      <span>{task.tasksProcessed.toLocaleString()} tasks processed</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.status !== "running" && (
                      <Button
                        size="sm"
                        onClick={() => onStartTask(task.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                    {task.status === "running" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPauseTask(task.id)}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    {(task.status === "running" || task.status === "paused") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStopTask(task.id)}
                      >
                        <Square className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onConfigureTask(task.id)}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {tasks.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="text-center py-8">
            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Automations Found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first automation task.
            </p>
            <Button>Create Automation</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
