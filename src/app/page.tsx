import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 gap-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-primary">Pipe</span>Flow CRM
        </h1>
        <p className="text-muted-foreground text-lg">
          CRM de vendas para PMEs, freelancers e times de vendas.
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Design System ✓</CardTitle>
          <CardDescription>Tema PipeFlow aplicado com sucesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary text-primary-foreground">Primary</Badge>
            <Badge className="bg-accent text-accent-foreground">Accent</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge className="bg-destructive text-white">Destructive</Badge>
          </div>

          <div className="space-y-2">
            <Button className="w-full">Comece grátis</Button>
            <Button variant="outline" className="w-full">Entrar</Button>
            <Button variant="ghost" className="w-full">Ghost</Button>
          </div>

          <div className="border rounded-lg p-4 space-y-1">
            <p className="text-sm font-medium">Tipografia</p>
            <p className="text-sm text-muted-foreground font-sans">Inter — texto de UI</p>
            <p className="font-mono text-sm text-primary">R$ 49,00 — JetBrains Mono</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[
              'bg-primary',
              'bg-accent',
              'bg-[oklch(0.696_0.170_162.2)]',
              'bg-[oklch(0.713_0.200_38.5)]',
              'bg-destructive',
            ].map((color, i) => (
              <div key={i} className={`h-8 rounded-md ${color}`} />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
