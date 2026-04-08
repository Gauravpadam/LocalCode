import { Button, Card, StatusBadge, DifficultyBadge } from '../components/common';

/**
 * Component Showcase page for testing and demonstrating common components
 * This page can be used for visual verification during development
 */
function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-50 mb-8">Component Showcase</h1>
        
        {/* Buttons Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="primary" disabled>Disabled Button</Button>
          </div>
        </Card>

        {/* Status Badges Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Status Badges</h2>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="Accepted" />
            <StatusBadge status="Wrong Answer" />
            <StatusBadge status="Time Limit Exceeded" />
            <StatusBadge status="Memory Limit Exceeded" />
            <StatusBadge status="Runtime Error" />
            <StatusBadge status="Compilation Error" />
            <StatusBadge status="Pending" />
            <StatusBadge status="Running" />
            <StatusBadge status="Judging" />
          </div>
        </Card>

        {/* Difficulty Badges Section */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Difficulty Badges</h2>
          <div className="flex flex-wrap gap-3">
            <DifficultyBadge difficulty="Easy" />
            <DifficultyBadge difficulty="Medium" />
            <DifficultyBadge difficulty="Hard" />
          </div>
        </Card>

        {/* Cards Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-xl font-bold text-slate-50 mb-2">Regular Card</h3>
              <p className="text-slate-300">This is a regular card with slate styling.</p>
            </Card>
            <Card hover>
              <h3 className="text-xl font-bold text-slate-50 mb-2">Hover Card</h3>
              <p className="text-slate-300">This card has hover effects enabled.</p>
            </Card>
            <Card className="bg-slate-800">
              <h3 className="text-xl font-bold text-slate-50 mb-2">Custom Card</h3>
              <p className="text-slate-300">This card has custom background color.</p>
            </Card>
          </div>
        </div>

        {/* Combined Example */}
        <Card>
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Combined Example</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-50">Two Sum</h3>
                <p className="text-sm text-slate-400">Array, Hash Table</p>
              </div>
              <div className="flex items-center gap-3">
                <DifficultyBadge difficulty="Easy" />
                <StatusBadge status="Accepted" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="primary">Submit</Button>
              <Button variant="secondary">Run</Button>
              <Button variant="outline">Reset</Button>
            </div>
          </div>
        </Card>
      </div>
       
    </div>
  );
}

export default ComponentShowcase;
