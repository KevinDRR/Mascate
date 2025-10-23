"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smile } from "lucide-react"

interface PlutchikWheelProps {
  selectedEmotions: string[]
  onEmotionsChange: (emotions: string[]) => void
}

const emotions = [
  {
    name: "Alegría",
    color: "bg-yellow-400 hover:bg-yellow-500",
    textColor: "text-yellow-900",
    intensity: ["Serenidad", "Alegría", "Éxtasis"],
  },
  {
    name: "Confianza",
    color: "bg-green-400 hover:bg-green-500",
    textColor: "text-green-900",
    intensity: ["Aceptación", "Confianza", "Admiración"],
  },
  {
    name: "Miedo",
    color: "bg-green-700 hover:bg-green-800",
    textColor: "text-green-50",
    intensity: ["Aprensión", "Miedo", "Terror"],
  },
  {
    name: "Sorpresa",
    color: "bg-cyan-400 hover:bg-cyan-500",
    textColor: "text-cyan-900",
    intensity: ["Distracción", "Sorpresa", "Asombro"],
  },
  {
    name: "Tristeza",
    color: "bg-blue-600 hover:bg-blue-700",
    textColor: "text-blue-50",
    intensity: ["Pensativo", "Tristeza", "Pena"],
  },
  {
    name: "Disgusto",
    color: "bg-purple-600 hover:bg-purple-700",
    textColor: "text-purple-50",
    intensity: ["Aburrimiento", "Disgusto", "Aversión"],
  },
  {
    name: "Ira",
    color: "bg-red-600 hover:bg-red-700",
    textColor: "text-red-50",
    intensity: ["Molestia", "Ira", "Furia"],
  },
  {
    name: "Anticipación",
    color: "bg-orange-500 hover:bg-orange-600",
    textColor: "text-orange-50",
    intensity: ["Interés", "Anticipación", "Vigilancia"],
  },
]

export function PlutchikWheel({ selectedEmotions, onEmotionsChange }: PlutchikWheelProps) {
  const [expandedEmotion, setExpandedEmotion] = useState<string | null>(null)

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      onEmotionsChange(selectedEmotions.filter((e) => e !== emotion))
    } else {
      onEmotionsChange([...selectedEmotions, emotion])
    }
  }

  const handleEmotionClick = (emotionName: string) => {
    if (expandedEmotion === emotionName) {
      setExpandedEmotion(null)
    } else {
      setExpandedEmotion(emotionName)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Smile className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Rueda de Emociones de Plutchik</CardTitle>
            <CardDescription>
              Seleccione las emociones que mejor describen el estado emocional del beneficiario
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected emotions display */}
        {selectedEmotions.length > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Emociones seleccionadas:</p>
            <div className="flex flex-wrap gap-2">
              {selectedEmotions.map((emotion) => (
                <Badge
                  key={emotion}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleEmotion(emotion)}
                >
                  {emotion} ✕
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Emotion grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emotions.map((emotion) => (
            <div key={emotion.name} className="space-y-2">
              <button
                type="button"
                onClick={() => handleEmotionClick(emotion.name)}
                className={`w-full p-4 rounded-lg transition-all ${emotion.color} ${emotion.textColor} font-semibold text-center shadow-md hover:shadow-lg transform hover:scale-105`}
              >
                {emotion.name}
              </button>

              {/* Intensity levels */}
              {expandedEmotion === emotion.name && (
                <div className="space-y-1 animate-in slide-in-from-top-2">
                  {emotion.intensity.map((level, index) => {
                    const isSelected = selectedEmotions.includes(level)
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => toggleEmotion(level)}
                        className={`w-full p-2 rounded text-sm transition-all ${
                          isSelected
                            ? `${emotion.color} ${emotion.textColor} shadow-md`
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        } ${index === 0 ? "opacity-60" : index === 2 ? "font-bold" : ""}`}
                      >
                        {level}
                        {isSelected && " ✓"}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            💡 <strong>Cómo usar:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Haga clic en una emoción principal para ver sus niveles de intensidad</li>
            <li>Seleccione el nivel que mejor describe la intensidad de la emoción</li>
            <li>Puede seleccionar múltiples emociones e intensidades</li>
            <li>Haga clic nuevamente para deseleccionar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
