import React from 'react';
import { Calendar } from './ui/calendar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  tasks?: any[];
}

const CalendarView = ({ tasks = [] }: CalendarViewProps) => {
  const [date, setDate] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<'month' | 'week'>('month');

  // Get tasks for the selected date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView(view === 'month' ? 'week' : 'month')}
          >
            {view === 'month' ? 'Week View' : 'Month View'}
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(date);
                newDate.setMonth(date.getMonth() - 1);
                setDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(date);
                newDate.setMonth(date.getMonth() + 1);
                setDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Tasks for {date.toLocaleDateString()}
          </h3>
          <div className="space-y-4">
            {getTasksForDate(date).length > 0 ? (
              getTasksForDate(date).map((task) => (
                <Card key={task.id} className="p-3 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No tasks for this date</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView; 