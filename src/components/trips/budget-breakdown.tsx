"use client";

import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import type { IBudgetBreakdown } from "@/models/Trip";

const BAR_COLORS = ["bg-moss", "bg-gold", "bg-clay", "bg-ink-soft"];

export function BudgetBreakdown({
  breakdown,
  plannedBudget,
}: {
  breakdown: IBudgetBreakdown;
  plannedBudget: number;
}) {
  const overBudget = breakdown.total > plannedBudget;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Estimated total
          </p>
          <p className="font-display text-3xl text-ink">
            {formatCurrency(breakdown.total, breakdown.currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Planned budget</p>
          <p className={overBudget ? "text-sm font-medium text-danger" : "text-sm font-medium text-moss-dark"}>
            {formatCurrency(plannedBudget, breakdown.currency)}
          </p>
        </div>
      </div>

      {overBudget && (
        <p className="mt-3 rounded-md bg-danger-tint px-3 py-2 text-xs text-danger">
          This plan runs above your budget. Ask the assistant to trim costs, or increase your budget when editing the trip.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {breakdown.categories.map((cat, i) => (
          <div key={cat.category}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="capitalize text-ink">{cat.category}</span>
              <span className="text-ink-soft">
                {formatCurrency(cat.amount, breakdown.currency)}
                <span className="ml-1.5 text-ink-soft/60">{Math.round(cat.percentage)}%</span>
              </span>
            </div>
            <Progress
              value={cat.percentage}
              indicatorClassName={BAR_COLORS[i % BAR_COLORS.length]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
