"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { forwardRef } from "react"

const features = [
  "Éditeur de texte avec Markdown",
  "Flashcards avec répétition espacée",
  "Tableaux Kanban personnalisables",
  "Timer Pomodoro avec statistiques",
  "Synchronisation multi-appareils",
  "Mode hors-ligne",
  "Support prioritaire"
]

const Pricing = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="w-full py-10 lg:py-20">
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-primary max-w-2xl">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Suite complète</CardTitle>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">Gratuit</span>
                </div>
                <CardDescription className="text-center">
                  Tous les outils dont vous avez besoin pour booster votre productivité
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center align-center">
                <div className="flex flex-col justify-center align-center gap-4">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg">
                  Commencer maintenant
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
})

Pricing.displayName = "Pricing"

export { Pricing } 